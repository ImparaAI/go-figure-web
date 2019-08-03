import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Vector } from '@app/structures/vector';
import { Point2D } from '@app/structures/point';
import { Drawing } from '@app/structures/drawing';
import { ApiService } from '@app/api/api.service';
import { FourierSeries } from '@app/structures/series';
import { OutputDatum } from '@app/drawing/animator/output';
import { CanvasManager } from '@app/canvas/canvas_manager';
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
  output: OutputDatum[] = [];
  canvasManager: CanvasManager;
  series: FourierSeries;
  maxVectorCount: number = 1;
  drawing: Drawing;
  originalOpacity: number = 0.2;
  trackOutput: boolean = false;
  scale: number = 1;
  painters: {
    vector: VectorPainter;
    output: OutputPainter;
    originalPoints: OriginalPointsPainter;
  };

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) {
    router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.load();
  }

  onCanvasReady(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
    this.painters = {
      vector: new VectorPainter(this.canvasManager),
      output: new OutputPainter(this.canvasManager),
      originalPoints: new OriginalPointsPainter(this.canvasManager),
    };
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
        this.initializeOutput();
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

    this.repaint();
    this.repositionCanvas();
    this.updateTime();

    window.requestAnimationFrame(() => this.animate());
  }

  repaint() {
    this.canvasManager.clearCanvas();
    this.painters.originalPoints.paint(this.drawing.originalPoints, this.originalOpacity);
    this.painters.vector.paint(this.series.vectors.slice(0, this.maxVectorCount));
    this.painters.output.paint(this.output, this.time);
  }

  repositionCanvas() {
    if (this.trackOutput && this.series.vectors.length) {
      let finalVector = this.series.vectors[this.series.vectors.length - 1],
          point = new Point2D(finalVector.end.x * this.scale, finalVector.end.y * this.scale);

      this.canvasManager.centerOn(point)
    }
  }

  updateTime() {
    this.prevTime = this.time;
    this.time += this.timeInterval;

    if (this.time >= 1)
      this.time -= 1;
  }

  initializeOutput() {
    for (var time = 0; time < 1; time += this.minTimeInterval) {
      this.output.push({time});
    }
  }

  updateOutput() {
    let index = (Math.round(this.prevTime / this.minTimeInterval) + 1) % this.output.length,
        finalIndex = Math.round(this.time / this.minTimeInterval) % this.output.length;

    //update all skipped outputs due to changing time interval
    while (this.time != this.prevTime && index != finalIndex) {
      this.updateOutputValues(this.output[index]);
      index = (index + 1) % this.output.length;
    }

    //update current output
    this.updateOutputValues(this.output[finalIndex]);
  }

  updateOutputValues(output: OutputDatum) {
    if (output.vectorCount == this.maxVectorCount)
      return;

    Object.assign(output, {
      vectorCount: this.maxVectorCount,
      point: this.getOutputPoint(output.time),
    });
  }

  getOutputPoint(time: number) {
    this.series.update(time, this.scale);

    let finalVector = this.series.vectors[this.maxVectorCount - 1];

    return new Point2D(finalVector.end.x, finalVector.end.y);
  }

  updateScale(scale: number) {
    this.scale = scale;

    for (let painter of Object.values(this.painters)) {
      painter.setScale(this.scale)
    }

    this.repaint();
  }

  incrementScale(scale: number) {
    this.updateScale(Math.max(0.01, this.scale + scale));
  }

  zoomInAndSlow() {
    this.timeInterval = this.minTimeInterval;
    this.trackOutput = true;
    this.updateScale(7);
  }

  resetZoomAndSpeed() {
    this.timeInterval = 0.005;
    this.trackOutput = false;
    this.updateScale(1);
    this.canvasManager.centerOn(this.series.getImageCenterpoint());
  }

}