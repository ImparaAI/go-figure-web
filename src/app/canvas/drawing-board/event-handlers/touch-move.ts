import { Drawing } from '@app/canvas/drawing-board/drawing';
import { TouchEventHandler } from '@app/canvas/drawing-board/event-handlers/touch-event-handler';

export class TouchMove extends TouchEventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventName(): string {
    return 'touchmove';
  }

  public handle(e: any): void {
    let position = this.getPosition(e);

    this.drawing.painter.mouseOutside();

    if (!this.drawing.cursorPressed || this.drawing.finalizer.running)
      return;

    if (this.outOfBounds(this.drawing.canvasManager.element, position))
    {
      this.drawing.liftCursor();
      this.drawing.finish();
      return;
    }

    this.drawing.addPoint(position.x, position.y);
  }

  protected outOfBounds(canvas: HTMLCanvasElement, position: {x: number, y: number}): boolean {
    return (position.x < 0) || (position.x > canvas.width) || (position.y < 0) || (position.y > canvas.height);
  }
}