import { Drawing } from '@app/canvas/draggable/drawing';
import { EventHandler } from '@app/canvas/draggable/event-handlers/event-handler';

export class MouseDown extends EventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventNames(): string[] {
    return ['mousedown'];
  }

  public handle(e: any): void {
    this.drawing.pressCursor(e.layerX, e.layerY);
  }
}