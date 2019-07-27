import { Router} from '@angular/router';
import { Component, ViewChild, ElementRef } from '@angular/core';

import { Point } from '@app/structures/point';
import { ApiService } from '@app/api/api.service';
import { CanvasManager } from '@app/structures/canvas_manager';

@Component({
  selector: 'iai-capturer',
  templateUrl: './capturer.component.html',
  styleUrls: ['./capturer.component.scss']
})
export class CapturerComponent {

  timestamp: number;
  mouseIsDown: boolean = false;
  lastPoint: Point = new Point;
  currentPoint: Point = new Point;
  data: {point: Point, time: number}[];
  canvasManager: CanvasManager;

  @ViewChild('canvas') canvas: ElementRef;

  constructor(private router: Router, private api: ApiService) { }

  ngAfterViewInit() {
    this.canvasManager = new CanvasManager(this.canvas.nativeElement);
    this.canvasManager.setLineWidth(1);
    this.canvasManager.setStrokeStyle('black');

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

    this.reset();
    this.updateMousePositions(x, y);
    this.canvasManager.paintPoint(this.currentPoint);
  }

  updateMousePositions(x, y) {
    this.lastPoint.update(this.currentPoint.x, this.currentPoint.y);
    this.currentPoint.update(x, y);

    this.captureData();
  }

  reset() {
    this.data = [];
    this.canvasManager.clearCanvas();
    this.timestamp = Date.now();
  }

  captureData() {
    let time = this.data.length ? (Date.now() - this.timestamp) / 1000 : 0.00,
        point = this.currentPoint.clone();

    this.data.push({point, time});
  }

  async submit()  {
    try {
      let response = await this.api.createDrawing(this.format());

      this.router.navigate(['drawing', response.id]);
    }
    catch (e) {
      alert('Fail.');
    }
  }

  format() {
    return this.data.map((data) => {
      return {x: data.point.x, y: data.point.y, time: data.time};
    });
  }
}