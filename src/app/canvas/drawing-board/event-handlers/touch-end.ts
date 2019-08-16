import { Drawing } from '@app/canvas/drawing-board/drawing';
import { TouchEventHandler } from '@app/canvas/drawing-board/event-handlers/touch-event-handler';

export class TouchEnd extends TouchEventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventName(): string {
    return 'touchend';
  }

  public handle(e: any): void {
    this.drawing.painter.mouseOutside();

    if (this.drawing.finalizer.running)
      return;

    this.drawing.liftCursor();
    this.drawing.finish();
  }
}