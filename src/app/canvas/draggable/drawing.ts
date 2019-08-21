import { Point2D } from '@app/structures/point';
import { Painter } from '@app/canvas/draggable/painter';
import { CanvasManager } from '@app/canvas/canvas_manager';

export class Drawing {
  canvasManager: CanvasManager;
  painter: Painter;
  cursorPressed: boolean = false;
  cursorPosition: Point2D = new Point2D;
  lastPressedPoint: Point2D;

  constructor(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
    this.painter = new Painter(this, this.canvasManager);
  }

  clear(): void {
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
      this.painter.paint();
    }
  }

  updateScale(scale: number, focalPoint: Point2D) {
    let boundedScale = Math.max(0.5, Math.min(1500, this.canvasManager.scale * scale));

    this.canvasManager.setScale(boundedScale, focalPoint);
    this.painter.paint();
  }

}