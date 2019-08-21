import { Drawing } from '@app/canvas/drawing-animator/drawing';
import { EventHandler } from '@app/canvas/drawing-animator/event-handlers/event-handler';

export class MouseOut extends EventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventNames(): string[] {
    return ['mouseout'];
  }

  public handle(e: any): void {
    this.drawing.liftCursor();
  }
}