import { Point2D } from '@app/structures/point';
import { Drawing } from '@app/canvas/draggable/drawing';
import { OutputBrush } from '@app/canvas/draggable/brushes/output';
import { VectorsBrush } from '@app/canvas/draggable/brushes/vector';
import { OriginalPointsBrush } from '@app/canvas/draggable/brushes/original';

export class Animator {

  drawing: Drawing;
  time: number = 0;
  prevTime: number = 0;
  timeInterval: number = 0.005;
  isAnimating: boolean = false;
  trackOutput: boolean = false;
  protected brushes: {
    output: OutputBrush;
    vectors: VectorsBrush;
    originalPoints: OriginalPointsBrush;
  }

  constructor(drawing: Drawing) {
    this.drawing = drawing;

    this.brushes = {
      output: new OutputBrush(drawing),
      vectors: new VectorsBrush(drawing),
      originalPoints: new OriginalPointsBrush(drawing),
    };
  }

  stop()  {
    this.time = 0;
    this.isAnimating = false;
    this.drawing.output.clear();
  }

  start()  {
    if (this.isAnimating)
      return;

    this.isAnimating = true;

    this.animate();
  }

  repaint() {
    this.repositionCanvas();
    this.drawing.canvasManager.clearCanvas();
    this.brushes.originalPoints.paint(this.drawing.originalPoints);
    this.brushes.vectors.paint(this.drawing.fourierSeries.vectors.slice(0, this.drawing.maxVectorCount));
    this.brushes.output.paint(this.drawing.output, this.drawing.animator.time);
  }

  protected animate() {
    if (!this.isAnimating)
      return;

    this.drawing.output.update(this.prevTime, this.time);
    this.drawing.fourierSeries.update(this.time);

    this.repaint();
    this.updateTime();

    window.requestAnimationFrame(() => this.animate());
  }

  protected repositionCanvas() {
    if (this.trackOutput && this.drawing.fourierSeries.vectors.length) {
      let finalVector = this.drawing.fourierSeries.vectors[this.drawing.maxVectorCount - 1];

      this.drawing.canvasManager.centerOn(new Point2D(finalVector.end.x, finalVector.end.y));
    }
  }

  protected updateTime() {
    this.prevTime = this.time;
    this.time += this.timeInterval;

    if (this.time >= 1)
      this.time -= 1;
  }

}