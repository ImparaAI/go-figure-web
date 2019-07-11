import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Point } from '@app/structures/point';
import { Painter } from '@app/structures/painter';
import { ApiService } from '@app/api/api.service';

@Component({
  selector: 'iai-capturer',
  templateUrl: './capturer.component.html',
  styleUrls: ['./capturer.component.scss']
})
export class CapturerComponent implements OnInit {

  intervalId: any;
  captureRate: number = 100;
  timestamp: number;
  mouseIsDown: boolean = false;
  lastPoint: Point = new Point;
  currentPoint: Point = new Point;
  allPoints: Point[] = [];
  data: Point[] = [];
  painter: Painter;

  @ViewChild('canvas') canvas: ElementRef;

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.painter = new Painter(this.canvas.nativeElement);
    this.painter.setLineWidth(1);
    this.painter.setStrokeStyle('black');

    this.canvas.nativeElement.addEventListener("mousemove", (e) => {
        this.mousemove(e.clientX, e.clientY)
    }, false);
    this.canvas.nativeElement.addEventListener("mousedown", (e) => {
        this.mousedown(e.clientX, e.clientY);
    }, false);
    this.canvas.nativeElement.addEventListener("mouseup", (e) => {
        this.mouseup();
    }, false);
    this.canvas.nativeElement.addEventListener("mouseout", (e) => {
        this.mouseup();
    }, false);
  }

  updateMousePositions(x, y) {
    this.lastPoint.x = this.currentPoint.x;
    this.lastPoint.y = this.currentPoint.y;
    this.currentPoint.x = x - this.canvas.nativeElement.offsetLeft;
    this.currentPoint.y = y - this.canvas.nativeElement.offsetTop;

    this.allPoints.push(new Point(this.currentPoint.x, this.currentPoint.y));
  }

  mousemove(x, y) {
    if (!this.mouseIsDown)
      return;

    this.updateMousePositions(x, y);
    this.painter.paintLine(this.lastPoint, this.currentPoint);
  }

  mouseup() {
    this.mouseIsDown = false;
    this.stopDataCapture();
  }

  mousedown(x, y) {
    this.mouseIsDown = true;
    this.painter.clearCanvas();
    this.allPoints = [];
    this.updateMousePositions(x, y);
    this.startDataCapture()
    this.painter.paintPoint(this.currentPoint);
  }

  startDataCapture() {
    this.data = [];
    this.timestamp = Date.now();

    this.captureData();

    this.intervalId = setInterval(() => this.captureData(), this.captureRate);
  }

  stopDataCapture() {
    clearInterval(this.intervalId);
  }

  captureData() {
    this.data.push(new Point(this.currentPoint.x, this.currentPoint.y));
  }

  async submit()  {
    try {
      let response = await this.api.createSubmission(this.data, 25);

      console.log(response);
      alert(JSON.stringify(response));
    }
    catch (e) {
      console.log(e);
      alert('Fail.');
      console.log(e);
    }
  }

}