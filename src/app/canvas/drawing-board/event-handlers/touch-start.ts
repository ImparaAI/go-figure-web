import { Drawing } from '@app/canvas/drawing-board/drawing';
import { TouchEventHandler } from '@app/canvas/drawing-board/event-handlers/touch-event-handler';

export class TouchStart extends TouchEventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventName(): string {
    return 'touchstart';
  }

  public handle(e: any): void {
    e.preventDefault();

    let position = this.getPosition(e);

    this.drawing.painter.mouseOutside();
    this.drawing.painter.paint();

    if (this.drawing.finalizer.running)
      return;

    this.drawing.clear();
    this.drawing.pressCursor();
    this.drawing.addPoint(position.x, position.y);
    this.drawing.painter.mouseInside();
  }
}