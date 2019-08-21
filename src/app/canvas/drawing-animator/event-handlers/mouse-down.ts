import { Drawing } from '@app/canvas/drawing-animator/drawing';
import { EventHandler } from '@app/canvas/drawing-animator/event-handlers/event-handler';

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