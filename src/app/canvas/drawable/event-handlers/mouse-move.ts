import { Point2D } from '@app/structures/point';
import { Drawing } from '@app/canvas/drawable/drawing';
import { EventHandler } from '@app/canvas/drawable/event-handlers/event-handler';

export class MouseMove extends EventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventName(): string {
    return 'mousemove';
  }

  public handle(e: any): void {
    this.drawing.painter.setCursorPosition(new Point2D(e.layerX, e.layerY));
    this.drawing.painter.paint();
    this.drawing.painter.mouseInside();

    if (!this.drawing.cursorPressed || this.drawing.finalizer.running)
      return;

    this.drawing.addPoint(e.layerX, e.layerY);
  }
}