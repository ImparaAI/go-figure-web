import { FourierSeries } from '@app/structures/series';
import { Point2D, Point3D } from '@app/structures/point';
import { CanvasManager } from '@app/canvas/canvas_manager';
import { Animator } from '@app/canvas/drawing-animator/animator';
import { OutputSeries } from '@app/canvas/drawing-animator/output-series';

export class Drawing {
  canvasManager: CanvasManager;
  animator: Animator;
  output: OutputSeries;
  fourierSeries: FourierSeries;
  cursorPressed: boolean = false;
  cursorPosition: Point2D = new Point2D;
  lastPressedPoint: Point2D;
  maxVectorCount: number;
  originalPoints: Point3D[];

  constructor(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
    this.animator = new Animator(this);
  }

  setData(drawVectors, originalPoints) {
    this.fourierSeries = new FourierSeries(drawVectors);;
    this.originalPoints = originalPoints.map((op) => new Point3D(op.x, op.y, op.time));
    this.output = new OutputSeries(this);
  }

  pressCursor(x: number, y: number): void {
    this.cursorPressed = true;
    this.lastPressedPoint = new Point2D(x, y);
  }

  liftCursor(): void {
    this.cursorPressed = false;
  }

  moveCursor(x: number, y: number): void {
    this.cursorPosition.update(x, y);

    if (!this.cursorPressed)
      return;

    let deltaX = x - this.lastPressedPoint.x,
        deltaY = y - this.lastPressedPoint.y;

    if (deltaX || deltaY) {
      this.canvasManager.shiftOrigin(deltaX, deltaY);
      this.lastPressedPoint = new Point2D(x, y);
      this.animator.repaint();
    }
  }

  setScale(scale: number, focalPoint?: Point2D) {
    let boundedScale = Math.max(0.5, Math.min(1500, scale));

    this.canvasManager.setScale(scale, focalPoint);
    this.animator.repaint();
  }

  scaleBy(scale: number, focalPoint?: Point2D) {
    this.setScale(this.canvasManager.scale * scale, focalPoint);
  }

}