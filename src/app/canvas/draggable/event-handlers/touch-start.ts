import { Drawing } from '@app/canvas/draggable/drawing';
import { EventHandler } from '@app/canvas/draggable/event-handlers/event-handler';

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