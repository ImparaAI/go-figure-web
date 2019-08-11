import { Drawing } from '@app/canvas/drawable/drawing';
import { EventHandler } from '@app/canvas/drawable/event-handlers/event-handler';

export class MouseUp extends EventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventName(): string {
    return 'mouseup';
  }

  public handle(e: any): void {
    this.drawing.painter.mouseInside();

    if (this.drawing.finalizer.running)
      return;

    this.drawing.liftCursor();
    this.drawing.finish();
  }
}