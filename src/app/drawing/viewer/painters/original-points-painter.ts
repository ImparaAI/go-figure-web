import { Point2D, Point3D } from '@app/structures/point';
import { CanvasManager } from '@app/canvas/canvas_manager';

export class OriginalPointsPainter {

  protected scale: number = 1;
  protected opacity: number = 0.2;
  protected rgb: string = "255, 255, 255";
  protected canvasManager: CanvasManager;

  constructor(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
  }

  public paint(originalPoints: Point3D[]): void {
    let lastValue: Point3D;

    originalPoints.forEach((value: Point3D, i: number) =>  {
      if (i != 0) {
        this.canvasManager.setLineWidth(3);
        this.canvasManager.setStrokeStyle(`rgba(${this.rgb}, ${this.opacity})`);
        this.canvasManager.paintLine(lastValue.toPoint2D(), value.toPoint2D(), this.scale);
      }

      lastValue = value;
    });
  }

  public setScale(scale: number): void {
    this.scale = scale;
  }

}