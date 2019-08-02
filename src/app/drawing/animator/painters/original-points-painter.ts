import { Point } from '@app/structures/point';
import { CanvasManager } from '@app/structures/canvas_manager';

export class OriginalPointsPainter {

  protected rgb: string;
  protected canvasManager: CanvasManager;

  constructor(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
    this.rgb = "0, 0, 0";
  }

  public paint(originalPoints: {x: number, y: number, time: number}[], opacity: number, scale: number): void {
    if (opacity <= 0)
      return;

    let lastValue;

    originalPoints.forEach((value, i) =>  {
      if (i != 0) {
        this.canvasManager.setLineWidth(3);
        this.canvasManager.setStrokeStyle(`rgba(${this.rgb}, ${opacity})`);
        this.canvasManager.paintLine(
          new Point(lastValue.x * scale, lastValue.y * scale),
          new Point(value.x * scale, value.y * scale)
        );
      }

      lastValue = value;
    });
  }

}