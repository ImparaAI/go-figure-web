import { Drawing } from '@app/canvas/draggable/drawing';
import { EventHandler } from '@app/canvas/draggable/event-handlers/event-handler';

export class MouseMove extends EventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventNames(): string[] {
    return ['mousemove'];
  }

  public handle(e: any): void {
    this.drawing.moveCursor(e.layerX, e.layerY);
  }
}