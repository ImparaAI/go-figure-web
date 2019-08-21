import { Drawing } from '@app/canvas/drawing-animator/drawing';
import { EventHandler } from '@app/canvas/drawing-animator/event-handlers/event-handler';

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