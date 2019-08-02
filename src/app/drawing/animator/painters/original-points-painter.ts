import { Point } from '@app/structures/point';
import { CanvasManager } from '@app/canvas/canvas_manager';

export class OriginalPointsPainter {

  protected scale: number = 1;
  protected rgb: string ="0, 0, 0";
  protected canvasManager: CanvasManager;

  constructor(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
  }

  public paint(originalPoints: {x: number, y: number, time: number}[], opacity: number): void {
    if (opacity <= 0)
      return;

    let lastValue;

    originalPoints.forEach((value, i) =>  {
      if (i != 0) {
        this.canvasManager.setLineWidth(3);
        this.canvasManager.setStrokeStyle(`rgba(${this.rgb}, ${opacity})`);
        this.canvasManager.paintLine(
          new Point(lastValue.x, lastValue.y),
          new Point(value.x, value.y),
          this.scale
        );
      }

      lastValue = value;
    });
  }

  public setScale(scale: number): void {
    this.scale = scale;
  }

}