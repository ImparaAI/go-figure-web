import { Drawing } from '@app/canvas/drawing-board/drawing';
import { EventHandler } from '@app/canvas/drawing-board/event-handlers/event-handler';

export class MouseOut extends EventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventName(): string {
    return 'mouseout';
  }

  public handle(e: any): void {
    this.drawing.painter.mouseOutside();

    if (this.drawing.finalizer.running)
      return;

    this.drawing.liftCursor();
    this.drawing.finish();
    this.drawing.painter.paint();
  }
}