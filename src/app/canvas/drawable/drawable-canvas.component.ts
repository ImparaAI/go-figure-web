import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { Vector } from '@app/structures/vector';
import { Point2D, Point3D } from '@app/structures/point';
import { CanvasManager } from '@app/canvas/canvas_manager';
import { DataPainter } from '@app/canvas/drawable/painters/data';
import { CursorPainter } from '@app/canvas/drawable/painters/cursor';
import { AnimationConfig } from '@app/canvas/drawable/animation-config';

@Component({
  selector: 'iai-drawable-canvas',
  templateUrl: './drawable-canvas.component.html',
  styleUrls: ['./drawable-canvas.component.scss']
})
export class DrawableCanvasComponent implements OnInit {

  timestamp: number;
  cursorPosition: Point2D;
  mouseIsDown: boolean = false;
  mouseOutsideCanvas: boolean = true;
  canvasManager: CanvasManager;
  lastPoint: Point2D = new Point2D;
  currentPoint: Point2D = new Point2D;
  data: Point3D[] = [];
  drawLimits: {left: number, right: number, top: number, bottom: number};
  imageCentered: boolean = true;
  animation: AnimationConfig = new AnimationConfig;
  painters: {
    data: DataPainter;
    cursor: CursorPainter;
  };

  @Input() width: number;
  @Input() height: number;
  @ViewChild('canvas') canvas: ElementRef;
  @Output() drawingUpdated = new EventEmitter<Point3D[]>();
  @Output() canvasInitialized = new EventEmitter<CanvasManager>();

  ngOnInit() {
    if (this.width === undefined || this.height === undefined) {
      throw new Error("A valid width and height need to be provided to the drawable canvas.")
    }

    this.animation.clear();
  }

  ngAfterViewInit() {
    this.bindEvents();
    this.canvasManager = new CanvasManager(this.canvas.nativeElement);
    this.canvasInitialized.emit(this.canvasManager);

    this.painters = {
      data: new DataPainter(this.canvasManager),
      cursor: new CursorPainter(this.canvasManager),
    };
  }

  bindEvents() {
    this.canvas.nativeElement.addEventListener("mousemove", (e) => {
        this.mousemove(e.layerX, e.layerY);
    }, false);
    this.canvas.nativeElement.addEventListener("mousedown", (e) => {
        this.mousedown(e.layerX, e.layerY);
    }, false);
    this.canvas.nativeElement.addEventListener("mouseup", (e) => {
        this.mouseup();
    }, false);
    this.canvas.nativeElement.addEventListener("mouseout", (e) => {
        this.mouseup();
    }, false);
  }

  mousemove(x: number, y: number) {
    this.cursorPosition = new Point2D(x, y);
    this.repaint();

    if (!this.mouseIsDown || this.animation.running)
      return;

    this.updateMousePositions(x, y);
    this.canvasManager.paintLine(this.lastPoint, this.currentPoint);
    this.mouseOutsideCanvas = false;
  }

  mouseup() {
    if (this.animation.running)
      return;

    this.mouseIsDown = false;
    this.completeImage();
    this.mouseOutsideCanvas = false;
  }

  mouseout() {
    this.mouseup();
    this.mouseOutsideCanvas = true;
    this.repaint();
  }

  mousedown(x: number, y: number) {
    this.repaint();

    if (this.animation.running)
      return;

    this.mouseIsDown = true;

    this.clear();
    this.updateMousePositions(x, y);
    this.canvasManager.paintPoint(this.currentPoint);
    this.mouseOutsideCanvas = false;
  }

  clear() {
    this.data = [];
    this.canvasManager.clearCanvas();
    this.timestamp = Date.now();
    this.drawLimits = undefined;
    this.imageCentered = true;
    this.drawingUpdated.emit(this.data);
  }

  updateMousePositions(x: number, y: number) {
    this.lastPoint.update(this.currentPoint.x, this.currentPoint.y);
    this.currentPoint.update(x, y);
    this.updateDrawLimits(x, y);

    this.captureData();
  }

  captureData() {
    let time = this.data.length ? (Date.now() - this.timestamp) / 1000 : 0.00;

    this.data.push(new Point3D(this.currentPoint.x, this.currentPoint.y, time));
    this.drawingUpdated.emit(this.data);
  }

  updateDrawLimits(x: number, y: number) {
    this.imageCentered = false;

    if (!this.drawLimits) {
      this.drawLimits = {left: x, right: x, top: y, bottom: y};
    }
    else {
      this.drawLimits.left = Math.min(x, this.drawLimits.left);
      this.drawLimits.right = Math.max(x, this.drawLimits.right);
      this.drawLimits.top = Math.max(y, this.drawLimits.top);
      this.drawLimits.bottom = Math.min(y, this.drawLimits.bottom);
    }
  }

  completeImage() {
    if (this.imageCentered)
      return;

    this.animation.running = true;
    this.animation.connecting = this.connectImage();
    this.animation.centering = this.centerImage();
    this.animate();
  }

  connectImage(): boolean {
    if (this.data.length < 3)
      return false;

    let firstPoint: Point3D = this.data[0],
        lastPoint: Point3D = this.data[this.data.length - 1],
        distance: number = (new Vector(firstPoint.toPoint2D(), lastPoint.toPoint2D())).length(),
        time: number = lastPoint.time + distance / 500;

    this.data.push(new Point3D(firstPoint.x, firstPoint.y, time));
    return true;
  }

  centerImage() {
    if (this.imageCentered || !this.drawLimits)
      return false;

    let xTranslation: number = (this.width - this.drawLimits.right - this.drawLimits.left) / 2,
        yTranslation: number = (this.height - this.drawLimits.bottom - this.drawLimits.top) / 2;

    this.animation.centeringDeltaX = xTranslation / this.animation.totalSteps;
    this.animation.centeringDeltaY = yTranslation / this.animation.totalSteps;
    return true;
  }

  animate() {
    if (this.animation.currentStep == this.animation.totalSteps) {
      this.completeAnimation();
      this.repaint();
      return;
    }

    if (this.animation.centering) {
      this.updateData(this.animation.centeringDeltaX, this.animation.centeringDeltaY);
    }

    this.repaint();
    this.animation.currentStep++;

    window.requestAnimationFrame(() => this.animate());
  }

  completeAnimation() {
    if (this.animation.centering)
      this.imageCentered = true;

    this.roundData();
    this.animation.clear();
    this.drawingUpdated.emit(this.data);
  }

  updateData(deltaX: number, deltaY: number) {
    this.data.forEach((point) => {
      point.update(point.x + deltaX, point.y + deltaY, point.time);
    })
  }

  roundData() {
    this.data.forEach((point: Point3D) => {
      point.update(Math.round(point.x), Math.round(point.y), point.time);
    });
  }

  repaint() {
    this.canvasManager.clearCanvas();

    if (this.data)
      this.painters.data.paint(this.data, this.animation);

    if (this.cursorPosition && !this.mouseOutsideCanvas && !this.animation.running)
      this.painters.cursor.paint(this.cursorPosition);
  }

}