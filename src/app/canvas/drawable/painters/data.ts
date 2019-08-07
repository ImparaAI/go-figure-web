import { Vector } from '@app/structures/vector';
import { Point2D, Point3D } from '@app/structures/point';
import { CanvasManager } from '@app/canvas/canvas_manager';
import { AnimationConfig } from '@app/canvas/drawable/animation-config';

export class DataPainter {

  protected lineWidth: number = 3;
  protected rgb: string = "255, 255, 255";
  protected canvasManager: CanvasManager;

  constructor(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
  }

  public paint(data: Point3D[], animation: AnimationConfig): void {
    let prevPoint: Point3D;
    this.canvasManager.setLineWidth(this.lineWidth);

    data.forEach((point, i) => {
      if (i == data.length - 1 && animation.centering) {

        let distance: number = (new Vector(prevPoint.toPoint2D(), point.toPoint2D())).length(),
            deltaX = (point.x - prevPoint.x) / animation.totalSteps * animation.currentStep,
            deltaY = (point.y - prevPoint.y) / animation.totalSteps * animation.currentStep,
            partialPoint = new Point2D(prevPoint.x + deltaX, prevPoint.y + deltaY);

        this.canvasManager.paintLine(prevPoint.toPoint2D(), partialPoint);
      }
      else if (i != 0) {
        this.canvasManager.paintLine(prevPoint.toPoint2D(), point.toPoint2D());
      }

      prevPoint = point;
    })
  }

}