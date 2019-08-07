import { Point2D } from '@app/structures/point';
import { CanvasManager } from '@app/canvas/canvas_manager';

export class CursorPainter {

  protected radius: number = 5;
  protected rgb: string = "255, 255, 255";
  protected canvasManager: CanvasManager;

  constructor(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
  }

  public paint(point: Point2D): void {
    this.canvasManager.setFillStyle(`rgba(${this.rgb}, 1)`);
    this.canvasManager.paintCircle(point, this.radius);
  }

}