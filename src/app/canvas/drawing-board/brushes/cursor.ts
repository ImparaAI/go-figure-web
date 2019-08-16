import { Point2D } from '@app/structures/point';
import { Drawing } from '@app/canvas/drawing-board/drawing';

export class CursorBrush {

  protected radius: number = 5;
  protected rgb: string = "255, 255, 255";
  protected drawing: Drawing;

  constructor(drawing: Drawing) {
    this.drawing = drawing;
  }

  public paint(point: Point2D): void {
    this.drawing.canvasManager.setFillStyle(`rgba(${this.rgb}, 1)`);
    this.drawing.canvasManager.paintCircle(point, this.radius);
  }

}