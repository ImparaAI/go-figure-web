import { Drawing } from '@app/canvas/drawable/drawing';
import { TouchEventHandler } from '@app/canvas/drawable/event-handlers/touch-event-handler';

export class TouchStart extends TouchEventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventName(): string {
    return 'touchstart';
  }

  public handle(e: any): void {
    let position = this.getPosition(e);

    this.drawing.painter.mouseOutside();
    this.drawing.painter.paint();

    if (this.drawing.finalizer.running)
      return;

    this.drawing.clear();
    this.drawing.pressCursor();
    this.drawing.addPoint(position.x, position.y);
    this.drawing.painter.mouseInside();
  }
}