import { Point2D } from '@app/structures/point';
import { Drawing } from '@app/canvas/drawable/drawing';
import { EventHandler } from '@app/canvas/drawable/event-handlers/event-handler';

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
    this.drawing.painter.mouseInside()
  }
}