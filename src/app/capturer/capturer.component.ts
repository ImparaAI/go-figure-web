import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

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
  lastPosition: {x: number, y: number} = {x: 0, y: 0};
  currentPosition: {x: number, y: number} = {x: 0, y: 0};
  allPositions: {x: number, y: number}[] = [];
  data: {x: number, y: number}[] = [];

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
    this.lastPosition.x = this.currentPosition.x;
    this.lastPosition.y = this.currentPosition.y;
    this.currentPosition.x = x - this.canvas.nativeElement.offsetLeft;
    this.currentPosition.y = y - this.canvas.nativeElement.offsetTop;

    this.allPositions.push({x: this.currentPosition.x, y: this.currentPosition.y});
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
    this.allPositions = [];
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
    this.data.push({x: this.currentPosition.x, y: this.currentPosition.y});
  }

  drawDot() {
    this.drawer.beginPath();
    this.drawer.fillStyle = 'lack';
    this.drawer.fillRect(this.currentPosition.x, this.currentPosition.y, 2, 2);
    this.drawer.closePath();
  }

  drawLine() {
    this.drawer.beginPath();
    this.drawer.moveTo(this.lastPosition.x, this.lastPosition.y);
    this.drawer.lineTo(this.currentPosition.x, this.currentPosition.y);
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