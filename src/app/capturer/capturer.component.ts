import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Point } from '@app/structures/point';
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

  @ViewChild('canvas') canvas: ElementRef;
  drawer: CanvasRenderingContext2D;

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.drawer = this.canvas.nativeElement.getContext('2d');

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

    this.drawLine();
  }

  mouseup() {
    this.mouseIsDown = false;
    this.stopDataCapture();
  }

  mousedown(x, y) {
    this.mouseIsDown = true;
    this.clearDrawing();
    this.allPoints = [];
    this.updateMousePositions(x, y);
    this.startDataCapture()
    this.drawDot();
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

  drawDot() {
    this.drawer.beginPath();
    this.drawer.fillStyle = 'black';
    this.drawer.fillRect(this.currentPoint.x, this.currentPoint.y, 2, 2);
    this.drawer.closePath();
  }

  drawLine() {
    this.drawer.beginPath();
    this.drawer.moveTo(this.lastPoint.x, this.lastPoint.y);
    this.drawer.lineTo(this.currentPoint.x, this.currentPoint.y);
    this.drawer.strokeStyle = "black";
    this.drawer.lineWidth = 1;
    this.drawer.stroke();
    this.drawer.closePath();
  }

  clearDrawing() {
    this.drawer.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
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