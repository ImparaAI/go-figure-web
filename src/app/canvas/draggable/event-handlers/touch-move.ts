import { Drawing } from '@app/canvas/draggable/drawing';
import { EventHandler } from '@app/canvas/draggable/event-handlers/event-handler';

export class TouchMove extends EventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventNames(): string[] {
    return ['touchmove'];
  }

  public handle(e: any): void {
    this.drawing.moveCursor(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }
}