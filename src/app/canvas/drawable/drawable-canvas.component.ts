import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { Point } from '@app/structures/point';
import { CanvasManager } from '@app/structures/canvas_manager';

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
  data: {point: Point, time: number}[];
  drawLimits: {left: number, right: number, top: number, bottom: number};
  imageCentered: boolean = true;

  @Input() width: number;
  @Input() height: number;
  height: number;
  @ViewChild('canvas') canvas: ElementRef;
  @Output() drawingUpdated = new EventEmitter<any>();
  @Output() canvasInitialized = new EventEmitter<any>();

  ngOnInit() {
    if (this.width === undefined || this.height === undefined) {
      throw new Error("A valid width and height need to be provided to the drawable canvas.")
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

  mousemove(x, y) {
    if (!this.mouseIsDown)
      return;

    this.updateMousePositions(x, y);
    this.canvasManager.paintLine(this.lastPoint, this.currentPoint);
  }

  mouseup() {
    this.mouseIsDown = false;
    this.centerImage();
  }

  mousedown(x, y) {
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

  updateMousePositions(x, y) {
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

  updateDrawLimits(x, y) {
    this.imageCentered = false;

    if (!this.drawLimits) {
      this.drawLimits = {left: x, right: x, top: y, bottom: y};
    }
    else {
      this.drawLimits.left = x < this.drawLimits.left ? x : this.drawLimits.left;
      this.drawLimits.right = x > this.drawLimits.right ? x : this.drawLimits.right;
      this.drawLimits.top = y > this.drawLimits.top ? y : this.drawLimits.top;
      this.drawLimits.bottom = y < this.drawLimits.bottom ? y : this.drawLimits.bottom;
    }
  }

  centerImage() {
    if (this.imageCentered || !this.drawLimits)
      return;

    let xTranslation: number = Math.floor(((this.width - this.drawLimits.right) - this.drawLimits.left) / 2),
        yTranslation: number = Math.floor(((this.height - this.drawLimits.bottom) - this.drawLimits.top) / 2),
        lastPoint: Point;

    this.canvasManager.clearCanvas();

    this.data.forEach((datum) => {
      datum.point.update(datum.point.x + xTranslation, datum.point.y + yTranslation);

      if (lastPoint)
        this.canvasManager.paintLine(lastPoint, datum.point);

      lastPoint = datum.point;
    })

    this.imageCentered = true;

    this.drawingUpdated.emit(this.data);
  }

}