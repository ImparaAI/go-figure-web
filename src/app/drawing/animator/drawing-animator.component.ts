import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Point } from '@app/structures/point';
import { Vector } from '@app/structures/vector';
import { Drawing } from '@app/structures/drawing';
import { ApiService } from '@app/api/api.service';
import { FourierSeries } from '@app/structures/series';
import { CanvasManager } from '@app/structures/canvas_manager';
import { VectorPainter } from '@app/drawing/animator/painters/vector-painter';
import { OutputPainter } from '@app/drawing/animator/painters/output-painter';
import { OriginalPointsPainter } from '@app/drawing/animator/painters/original-points-painter';

@Component({
  selector: 'iai-drawing-animator',
  templateUrl: './drawing-animator.component.html',
  styleUrls: ['./drawing-animator.component.scss']
})
export class DrawingAnimatorComponent implements OnInit {

  loading: boolean = true;
  id: number;
  time: number = 0;
  prevTime: number = 0;
  minTimeInterval: number = 0.0005;
  timeInterval: number = 0.005;
  run: boolean = false;
  output: {point: Point, t: number, shouldDraw: boolean}[] = [];
  canvasManager: CanvasManager;
  series: FourierSeries;
  maxVectorCount: number = 1;
  drawing: Drawing;
  originalOpacity: number = 0.2;
  trackOutput: boolean = false;
  scale: number = 1;
  vectorPainter: VectorPainter;
  outputPainter: OutputPainter;
  originalPointsPainter: OriginalPointsPainter;

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) {
    router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.load();
  }

  onCanvasReady(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
    this.vectorPainter = new VectorPainter(this.canvasManager);
    this.outputPainter = new OutputPainter(this.canvasManager);
    this.originalPointsPainter = new OriginalPointsPainter(this.canvasManager);
  }

  async load() {
    try {
      this.drawing = new Drawing(await this.api.getDrawing(this.id));
      this.maxVectorCount = this.drawing.drawVectors.length;

      if (!this.maxVectorCount) {
        setTimeout(()=>{
          this.loading = false;
          this.load()
        }, 1000)
      }
      else {
        this.series = new FourierSeries(this.drawing.drawVectors);
        this.calculateOutput();
        this.loading = false;
        this.start();
      }
    }
    catch (e) {

    }
  }

  stop()  {
    this.time = 0;
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

    this.updateOutput();
    this.series.update(this.time, this.scale);

    this.paint();
    this.repositionCanvas();
    this.updateTime();

    window.requestAnimationFrame(() => this.animate());
  }

  paint() {
    this.canvasManager.clearCanvas();
    this.originalPointsPainter.paint(this.drawing.originalPoints, this.originalOpacity, this.scale);
    this.vectorPainter.paint(this.series.vectors.slice(0, this.maxVectorCount));
    this.outputPainter.paint(this.output, this.time, this.scale);
    console.log(this.output)
  }

  repositionCanvas() {
    if (this.trackOutput && this.output.length) {
      this.canvasManager.centerOn(this.output[this.output.length - 1].point)
    }
  }

  updateTime() {
    this.prevTime = this.time;
    this.time += this.timeInterval;

    if (this.time >= 1)
      this.time -= 1;
  }

  calculateOutput() {
    let lastVector: Vector;

    for (var t = 0; t < 1; t += this.minTimeInterval) {
      this.series.update(t, this.scale);
      lastVector = this.series.vectors[this.maxVectorCount - 1]

      this.output.push({
        t: t,
        shouldDraw: false,
        point: new Point(lastVector.end.x, lastVector.end.y),
      });
    }
  }

  updateOutput() {
    let from = Math.round(this.prevTime / this.minTimeInterval) % this.output.length,
        to = Math.round(this.time / this.minTimeInterval) % this.output.length,
        vector;

    for (var i = from; i <= to;  i = (i + 1) % this.output.length) {
      this.series.update(this.output[i].t, this.scale);
      vector = this.series.vectors[this.maxVectorCount - 1]

      this.output[i].point = new Point(vector.end.x, vector.end.y);
    }
  }

  incrementScale(scale: number) {
    this.scale += scale;
  }

}