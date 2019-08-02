import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { Point } from '@app/structures/point';
import { CanvasManager } from '@app/structures/canvas_manager';

interface DataPoint {
  point: Point;
  time: number;
}

@Component({
  selector: 'iai-drawable-canvas',
  templateUrl: './drawable-canvas.component.html',
})
export class DrawableCanvasComponent implements OnInit {

  timestamp: number;
  mouseIsDown: boolean = false;
  canvasManager: CanvasManager;
  lastPoint: Point = new Point;
  currentPoint: Point = new Point;
  data: DataPoint[];
  drawLimits: {left: number, right: number, top: number, bottom: number};
  imageCentered: boolean = true;
  animation: {
    running: boolean,
    currentStep: number,
    totalSteps: number,
  }

  @Input() width: number;
  @Input() height: number;
  @ViewChild('canvas') canvas: ElementRef;
  @Output() drawingUpdated = new EventEmitter<DataPoint[]>();
  @Output() canvasInitialized = new EventEmitter<CanvasManager>();

  ngOnInit() {
    if (this.width === undefined || this.height === undefined) {
      throw new Error("A valid width and height need to be provided to the drawable canvas.")
    }

    this.animation = {
      running: false,
      currentStep: 0,
      totalSteps: 25,
    }
  }

  ngAfterViewInit() {
    this.bindEvents();
    this.canvasManager = new CanvasManager(this.canvas.nativeElement);
    this.canvasInitialized.emit(this.canvasManager);
  }

  bindEvents() {
    this.canvas.nativeElement.addEventListener("mousemove", (e) => {
        this.mousemove(e.layerX, e.layerY)
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
    if (!this.mouseIsDown || this.animation.running)
      return;

    this.updateMousePositions(x, y);
    this.canvasManager.paintLine(this.lastPoint, this.currentPoint);
  }

  mouseup() {
    if (this.animation.running)
      return;

    this.mouseIsDown = false;
    this.centerImage();
  }

  mousedown(x: number, y: number) {
    if (this.animation.running)
      return;

    this.mouseIsDown = true;

    this.clear();
    this.updateMousePositions(x, y);
    this.canvasManager.paintPoint(this.currentPoint);
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
    let time = this.data.length ? (Date.now() - this.timestamp) / 1000 : 0.00,
        point = this.currentPoint.clone();

    this.data.push({point, time});
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

  centerImage() {
    if (this.imageCentered || !this.drawLimits)
      return;

    let xTranslation: number = (this.width - this.drawLimits.right - this.drawLimits.left) / 2,
        yTranslation: number = (this.height - this.drawLimits.bottom - this.drawLimits.top) / 2;

    this.animation.running = true;
    this.animation.currentStep = 0;
    this.animateToCenter(xTranslation / this.animation.totalSteps, yTranslation / this.animation.totalSteps);
  }

  animateToCenter(deltaX: number, deltaY: number) {
    if (this.animation.currentStep == this.animation.totalSteps) {
      this.completeAnimation();
      return;
    }

    this.canvasManager.clearCanvas();
    this.moveImage(deltaX, deltaY);
    this.animation.currentStep++;

    window.requestAnimationFrame(() => this.animateToCenter(deltaX, deltaY));
  }

  completeAnimation() {
    this.roundData();
    this.imageCentered = true;
    this.animation.running = false;
    this.drawingUpdated.emit(this.data);
  }

  moveImage(deltaX: number, deltaY: number) {
    let lastPoint: Point;

    this.data.forEach((datum) => {
      datum.point.update(datum.point.x + deltaX, datum.point.y + deltaY);

      if (lastPoint)
        this.canvasManager.paintLine(lastPoint, datum.point);

      lastPoint = datum.point;
    })
  }

  roundData() {
    this.data.forEach((datum) => {
      datum.point.update(Math.round(datum.point.x), Math.round(datum.point.y));
    });
  }

}