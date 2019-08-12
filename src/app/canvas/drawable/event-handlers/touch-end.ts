import { Drawing } from '@app/canvas/drawable/drawing';
import { TouchEventHandler } from '@app/canvas/drawable/event-handlers/touch-event-handler';

export class TouchEnd extends TouchEventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventName(): string {
    return 'touchend';
  }

  public handle(e: any): void {
    if (this.drawing.finalizer.running)
      return;

    this.drawing.liftCursor();
    this.drawing.finish();
  }
}