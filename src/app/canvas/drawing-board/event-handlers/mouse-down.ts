import { Drawing } from '@app/canvas/drawing-board/drawing';
import { EventHandler } from '@app/canvas/drawing-board/event-handlers/event-handler';

export class MouseDown extends EventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventName(): string {
    return 'mousedown';
  }

  public handle(e: any): void {
    this.drawing.painter.paint();

    if (this.drawing.finalizer.running)
      return;

    this.drawing.clear();
    this.drawing.pressCursor();
    this.drawing.addPoint(e.layerX, e.layerY);
    this.drawing.painter.mouseInside();
  }
}