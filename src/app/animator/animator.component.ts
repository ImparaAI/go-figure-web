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

  t: number;
  id: number;
  timeInterval: number = .005;
  run: boolean = false;
  timeout: number = 100;
  output: {point: Point, t: number, opacity: number}[] = [];
  offset: Point = new Point(200, -200);
  pathTransparencyRatio: number = .4;
  painter: Painter;
  series: FourierSeries;

  @ViewChild('canvas') canvas: ElementRef;

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.load();
  }

  ngAfterViewInit() {
    this.painter = new Painter(this.canvas.nativeElement);
  }

  async load() {
    try {
      let drawing = await this.api.getDrawing(this.id);

      this.series = new FourierSeries(drawing.drawVectors);
    }
    catch (e) {

    }
  }

  stop()  {
    this.run = false;
    this.t = -1 * this.timeInterval;
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

    this.t += this.timeInterval;

    if (this.t >= 1)
      this.t -= 1;

    this.painter.clearCanvas();
    this.paintVectors();
    this.paintOutput();

    window.requestAnimationFrame(() => this.animate());
  }

  paintVectors() {
    this.series.update(this.t);

    //transform vectors for visibility until we have real values
    let transformedVectors = this.series.vectors.map((v: Vector) => this.getTransformedVector(v));

    this.painter.setLineWidth(1);
    this.painter.setStrokeStyle('rgba(0, 0, 0, 1)');
    this.painter.paintVectors(transformedVectors);
  }

  getTransformedVector(v: Vector) {
    let t = new Vector;

    t.start = this.getTransFormedPoint(v.start);
    t.end = this.getTransFormedPoint(v.end);

    return t;
  }

  getTransFormedPoint(p: Point) {
    return new Point(this.offset.x + 100 * p.x, -1 * (this.offset.y + 100 * p.y));
  }

  paintOutput() {
    this.updateOutput();

    let lastValue;

    this.output.forEach((value, i) =>  {
      if (i != 0) {
        this.painter.setLineWidth(3);
        this.painter.setStrokeStyle("rgba(255, 165, 0, "  + value.opacity + ")");

        this.painter.paintLine(
          this.getTransFormedPoint(lastValue.point),
          this.getTransFormedPoint(value.point)
        );
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
    let lastVector = this.series.vectors[this.series.vectors.length - 1];

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

}
