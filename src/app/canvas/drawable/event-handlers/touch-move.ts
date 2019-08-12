import { Drawing } from '@app/canvas/drawable/drawing';
import { TouchEventHandler } from '@app/canvas/drawable/event-handlers/touch-event-handler';

export class TouchMove extends TouchEventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventName(): string {
    return 'touchmove';
  }

  public handle(e: any): void {
    let position = this.getPosition(e);

    if (!this.drawing.cursorPressed || this.drawing.finalizer.running)
      return;

    this.drawing.addPoint(position.x, position.y);
  }
}