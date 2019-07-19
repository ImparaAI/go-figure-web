import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Point } from '@app/structures/point';
import { Vector } from '@app/structures/vector';
import { Painter } from '@app/structures/painter';
import { ApiService } from '@app/api/api.service';
import { FourierSeries } from '@app/structures/series';

@Component({
  selector: 'iai-animator',
  templateUrl: './animator.component.html',
  styleUrls: ['./animator.component.scss']
})
export class AnimatorComponent implements OnInit {

  t: number = 0;
  id: number;
  timeInterval: number = .005;
  run: boolean = false;
  timeout: number = 100;
  output: {point: Point, t: number, opacity: number}[] = [];
  pathTransparencyRatio: number = .4;
  painter: Painter;
  series: FourierSeries;

  maxVectorCount: number = 1;

  @ViewChild('canvas') canvas: ElementRef;

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.load();
  }

  ngAfterViewInit() {
    this.painter = new Painter(this.canvas.nativeElement);
    this.bindDraggableCanvas();
  }

  async load() {
    try {
      let drawing = await this.api.getDrawing(this.id);

      this.series = new FourierSeries(drawing.drawVectors);
      this.maxVectorCount = this.series.vectors.length;
    }
    catch (e) {

    }
  }

  stop()  {
    this.t = 0;
    this.run = false;
    this.output = [];
  }

  pause()  {
    this.run = false;
  }

  start()  {
    if (this.run)
      return;

    this.run = true;

    this.animate();
  }

  animate() {
    if (!this.run)
      return;

    this.painter.clearCanvas();
    this.paintVectors();
    this.paintOutput();

    this.t += this.timeInterval;

    if (this.t >= 1)
      this.t -= 1;

    window.requestAnimationFrame(() => this.animate());
  }

  paintVectors() {
    this.series.update(this.t);

    this.painter.setLineWidth(1);
    this.painter.setStrokeStyle('rgba(0, 0, 0, 1)');
    this.painter.paintVectors(this.series.vectors.slice(0, this.maxVectorCount));
  }

  paintOutput() {
    this.updateOutput();

    let lastValue;

    this.output.forEach((value, i) =>  {
      if (i != 0) {
        this.painter.setLineWidth(3);
        this.painter.setStrokeStyle("rgba(255, 165, 0, "  + value.opacity + ")");
        this.painter.paintLine(lastValue.point, value.point);
      }

      lastValue = value;
    });
  }

  updateOutput() {
    if (!this.series.vectors.length)
      return;

    this.appendOutput();
    this.removeCyclicalValues();
    this.applyOutputTransparency();
  }

  appendOutput() {
    let lastVector = this.series.vectors[this.maxVectorCount - 1];

    this.output.push({
      t: this.t,
      opacity: 1,
      point: new Point(lastVector.end.x, lastVector.end.y),
    });
  }

  removeCyclicalValues() {
    let removeCount = 0;

    for (let i = 0; i < this.output.length; ++i) {
      //remove points close to new point
      if (this.getNormalizedDistance(this.output[i]) >= .99)
        removeCount++;

      else
        break;
    }

    if (removeCount)
      this.output.splice(0, removeCount + 1)
  }

  applyOutputTransparency() {
    let distance,
        transparencySlope = 1 / this.pathTransparencyRatio;

    for (let i = 0; i < this.output.length; ++i) {
      distance = this.getNormalizedDistance(this.output[i]);

      if (distance >= 1 - this.pathTransparencyRatio)
        this.output[i].opacity = -1 * transparencySlope * distance + transparencySlope;

      else
        return;
    }
  }

  getNormalizedDistance(currentValue) {
    let lastTime = this.output[this.output.length - 1].t,
        currentTime = currentValue.t;

      if (currentTime > lastTime)
        lastTime += 1;

      return Math.abs(lastTime - currentTime);
  }



  //maybe make a draggable canvas component to remove all of this
  mouseIsDown: boolean;
  dragStart: Point;

  bindDraggableCanvas() {
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


    if (this.canvas.nativeElement.addEventListener) {
      this.canvas.nativeElement.addEventListener("wheel", (e) => this.handleMousescroll(e), false);
      this.canvas.nativeElement.addEventListener("DOMMouseScroll", (e) => this.handleMousescroll(e), false);
    }
    else
      this.canvas.nativeElement.attachEvent("onmousewheel", (e) => this.handleMousescroll(e));

  }

  handleMousescroll(e) {
    e = window.event || e;
    e.stopPropagation();
    event.preventDefault();
    this.mousescroll(e.wheelDelta || -e.detail);

    return false;
  }

  mousescroll(pixles: number) {
    let val = pixles > 0 ? 1.1 : 0.9;

    this.painter.zoom(val);
  }

  mousemove(x, y) {
    if (!this.mouseIsDown)
      return;

    let deltaX = x - this.dragStart.x,
        deltaY = y - this.dragStart.y;

    if (deltaX || deltaY) {
      this.painter.shiftOrigin(deltaX, deltaY)
      this.dragStart = new Point(x, y);
    }
  }

  mouseup() {
    this.mouseIsDown = false;
  }

  mousedown(x, y) {
    this.mouseIsDown = true;
    this.dragStart = new Point(x, y);
  }

}
