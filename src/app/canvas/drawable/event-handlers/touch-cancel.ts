import { Drawing } from '@app/canvas/drawable/drawing';
import { TouchEventHandler } from '@app/canvas/drawable/event-handlers/touch-event-handler';

export class TouchCancel extends TouchEventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventName(): string {
    return 'touchcancel';
  }

  public handle(e: any): void {
    this.drawing.painter.mouseOutside();

    if (this.drawing.finalizer.running)
      return;

    this.drawing.liftCursor();
    this.drawing.finish();
  }
}