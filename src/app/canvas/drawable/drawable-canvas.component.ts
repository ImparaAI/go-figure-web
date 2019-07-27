import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { Point } from '@app/structures/point';
import { CanvasManager } from '@app/structures/canvas_manager';

@Component({
  selector: 'iai-drawable-canvas',
  templateUrl: './drawable-canvas.component.html',
})
export class DrawableCanvasComponent {

  timestamp: number;
  mouseIsDown: boolean = false;
  canvasManager: CanvasManager;
  lastPoint: Point = new Point;
  currentPoint: Point = new Point;
  data: {point: Point, time: number}[];

  @ViewChild('canvas') canvas: ElementRef;
  @Output() drawingUpdated = new EventEmitter<any>();
  @Output() canvasInitialized = new EventEmitter<any>();

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
    this.drawingUpdated.emit(this.data);
  }

  updateMousePositions(x, y) {
    this.lastPoint.update(this.currentPoint.x, this.currentPoint.y);
    this.currentPoint.update(x, y);

    this.captureData();
  }

  captureData() {
    let time = this.data.length ? (Date.now() - this.timestamp) / 1000 : 0.00,
        point = this.currentPoint.clone();

    this.data.push({point, time});
    this.drawingUpdated.emit(this.data);
  }

}
