import { Drawing } from '@app/canvas/drawing-animator/drawing';
import { EventHandler } from '@app/canvas/drawing-animator/event-handlers/event-handler';

export class TouchStart extends EventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventNames(): string[] {
    return ['touchstart'];
  }

  public handle(e: any): void {
    this.drawing.pressCursor(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }
}