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
      if (prevPoint) {
        if (this.shouldAnimate(animation, data, i)) {
          let endPoint = this.getAnimationEndPoint(animation, prevPoint, point);

          this.canvasManager.paintLine(prevPoint.toPoint2D(), endPoint);
        }
        else
          this.canvasManager.paintLine(prevPoint.toPoint2D(), point.toPoint2D());
      }

      prevPoint = point;
    })
  }

  protected shouldAnimate(animation: AnimationConfig, data: Point3D[], index: number): boolean {
    return index == data.length - 1 && animation.centering;
  }

  protected getAnimationEndPoint(animation: AnimationConfig, fromPoint: Point3D, toPoint: Point3D): Point2D {
    let distance = (new Vector(fromPoint.toPoint2D(), toPoint.toPoint2D())).length(),
        deltaX = (toPoint.x - fromPoint.x) / animation.totalSteps * animation.currentStep,
        deltaY = (toPoint.y - fromPoint.y) / animation.totalSteps * animation.currentStep,

    return new Point2D(fromPoint.x + deltaX, fromPoint.y + deltaY);
  }

}