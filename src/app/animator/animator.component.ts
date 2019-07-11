import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Point } from '@app/structures/point';
import { Vector } from '@app/structures/vector';
import { Painter } from '@app/structures/painter';
import { ApiService } from '@app/api/api.service';

@Component({
  selector: 'iai-animator',
  templateUrl: './animator.component.html',
  styleUrls: ['./animator.component.scss']
})
export class AnimatorComponent implements OnInit {

  t: number;
  timeInterval: number = .005;
  run: boolean = false;
  timeout: number = 100;
  params: {n: number, c: number}[];
  vectors: Vector[];
  output: {point: Point, t: number, opacity: number}[] = [];
  offset: Point = new Point(200, -200);
  pathTransparencyRatio: number = .4;
  painter: Painter;

  @ViewChild('canvas') canvas: ElementRef;

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');

    this.t = -1 * this.timeInterval;
    this.params = [
      {n: 0, c: 1},
      {n: 1, c: .5},
      {n: -1, c: .4},
      {n: 2, c: .3},
    ];

    this.vectors = this.params.map(() => new Vector);
  }

  ngAfterViewInit() {
    this.painter = new Painter(this.canvas.nativeElement);
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
    this.vectors.forEach((v: Vector, i: number) => this.updateVector(v, i));

    //transform vectors for visibility until we have real values
    let transformedVectors = this.vectors.map((v: Vector) => this.getTransformedVector(v));

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

  updateVector(v: Vector, index: number) {
    let params = this.params[index],
        val = 2 * Math.PI * params.n * this.t;

    v.start.x = index == 0 ? 0 : this.vectors[index-1].end.x;
    v.start.y = index == 0 ? 0 : this.vectors[index-1].end.y;
    v.end.x = v.start.x + params.c * Math.cos(val);
    v.end.y = v.start.y + params.c * Math.sin(val);
  }

  updateOutput() {
    if (!this.vectors.length)
      return;

    this.appendOutput();
    this.removeCyclicalValues();
    this.applyOutputTransparency();
  }

  appendOutput() {
    let lastVector = this.vectors[this.vectors.length - 1];

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
