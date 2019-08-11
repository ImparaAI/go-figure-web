import { Vector } from '@app/structures/vector';
import { Drawing } from '@app/canvas/drawable/drawing';
import { Point2D, Point3D } from '@app/structures/point';

export class DataBrush {

  protected lineWidth: number = 3;
  protected rgb: string = "255, 255, 255";
  protected drawing: Drawing;

  constructor(drawing: Drawing) {
    this.drawing = drawing;
  }

  public paint(data: Point3D[]): void {
    let prevPoint: Point3D;
    this.drawing.canvasManager.setFillStyle(`rgba(${this.rgb}, 1)`);
    this.drawing.canvasManager.setLineWidth(this.lineWidth);

    data.forEach((point, i) => {
      if (prevPoint) {
        if (i == data.length - 1 && this.drawing.finalizer.centering) {
          let endPoint = this.getAnimationEndPoint(prevPoint, point);

          this.drawing.canvasManager.paintLine(prevPoint.toPoint2D(), endPoint);
        }
        else
          this.drawing.canvasManager.paintLine(prevPoint.toPoint2D(), point.toPoint2D());
      }

      prevPoint = point;
    })
  }

  protected getAnimationEndPoint(fromPoint: Point3D, toPoint: Point3D): Point2D {
    let distance = (new Vector(fromPoint.toPoint2D(), toPoint.toPoint2D())).length(),
        deltaX = (toPoint.x - fromPoint.x) / this.drawing.finalizer.totalSteps * this.drawing.finalizer.currentStep,
        deltaY = (toPoint.y - fromPoint.y) / this.drawing.finalizer.totalSteps * this.drawing.finalizer.currentStep;

    return new Point2D(fromPoint.x + deltaX, fromPoint.y + deltaY);
  }

}