import { Drawing } from '@app/canvas/draggable/drawing';
import { Point2D, Point3D } from '@app/structures/point';

export class OriginalPointsBrush {

  protected opacity: number = 0.2;
  protected rgb: string = "255, 255, 255";
  protected drawing: Drawing;

  constructor(drawing: Drawing) {
    this.drawing = drawing;
  }

  public paint(originalPoints: Point3D[]): void {
    let lastValue: Point3D;

    originalPoints.forEach((value: Point3D, i: number) =>  {
      if (i != 0) {
        this.drawing.canvasManager.setLineWidth(3);
        this.drawing.canvasManager.setStrokeStyle(`rgba(${this.rgb}, ${this.opacity})`);
        this.drawing.canvasManager.paintLine(lastValue.toPoint2D(), value.toPoint2D());
      }

      lastValue = value;
    });
  }

}