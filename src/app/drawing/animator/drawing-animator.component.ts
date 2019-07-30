import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Point } from '@app/structures/point';
import { Vector } from '@app/structures/vector';
import { Drawing } from '@app/structures/drawing';
import { ApiService } from '@app/api/api.service';
import { FourierSeries } from '@app/structures/series';
import { CanvasManager } from '@app/structures/canvas_manager';

@Component({
  selector: 'iai-drawing-animator',
  templateUrl: './drawing-animator.component.html',
  styleUrls: ['./drawing-animator.component.scss']
})
export class DrawingAnimatorComponent implements OnInit {

  loading: boolean = true;
  t: number = 0;
  id: number;
  timeInterval: number = .005;
  run: boolean = false;
  timeout: number = 100;
  output: {point: Point, t: number, opacity: number}[] = [];
  pathTransparencyRatio: number = .4;
  canvasManager: CanvasManager;
  series: FourierSeries;
  showOriginal: boolean = false;
  maxVectorCount: number = 1;
  drawing: Drawing;

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) {
    router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.load();
  }

  onCanvasReady(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
  }

  async load() {
    try {
      this.drawing = new Drawing(await this.api.getDrawing(this.id));
      this.series = new FourierSeries(this.drawing.drawVectors);
      this.maxVectorCount = this.drawing.drawVectors.length;

      if (!this.maxVectorCount) {
        setTimeout(()=>{
          this.loading = false;
          this.load()
        }, 1000)
      }
      else {
        this.loading = false;
        this.start()
      }
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

    this.canvasManager.clearCanvas();

    if (this.showOriginal) {
      this.paintOriginal();
    }
    this.paintVectors();
    this.paintOutput();

    this.t += this.timeInterval;

    if (this.t >= 1)
      this.t -= 1;

    window.requestAnimationFrame(() => this.animate());
  }

  paintVectors() {
    this.series.update(this.t);

    this.canvasManager.setLineWidth(1);
    this.canvasManager.setStrokeStyle('rgba(0, 0, 0, 1)');
    this.canvasManager.paintVectors(this.series.vectors.slice(0, this.maxVectorCount));
  }

  paintOutput() {
    this.updateOutput();

    let lastValue;

    this.output.forEach((value, i) =>  {
      if (i != 0) {
        this.canvasManager.setLineWidth(3);
        this.canvasManager.setStrokeStyle("rgba(255, 165, 0, "  + value.opacity + ")");
        this.canvasManager.paintLine(lastValue.point, value.point);
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

  paintOriginal() {
    let lastValue;

    this.drawing.originalPoints.forEach((value, i) =>  {
      if (i != 0) {
        this.canvasManager.setLineWidth(3);
        this.canvasManager.setStrokeStyle("rgba(0, 0, 0)");
        this.canvasManager.paintLine(new Point(lastValue.x, lastValue.y), new Point(value.x, value.y));
      }

      lastValue = value;
    });
  }

}