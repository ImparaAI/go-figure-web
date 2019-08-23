import { Drawing } from '@app/canvas/drawing-animator/drawing';
import { EventHandler } from '@app/canvas/drawing-animator/event-handlers/event-handler';

export class TouchMove extends EventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventNames(): string[] {
    return ['touchmove'];
  }

  public handle(e: any): void {
    if (e.touches.length == 1)
      this.drawing.moveCursor(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }
}