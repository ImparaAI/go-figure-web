import { Drawing } from '@app/canvas/draggable/drawing';
import { EventHandler } from '@app/canvas/draggable/event-handlers/event-handler';

export class MouseWheel extends EventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventNames(): string[] {
    return ['wheel', 'DOMMouseScroll'];
  }

  public handle(e: any): void {
    let event = window.event || e,
        data = event.wheelDelta || -event.detail,
        scale = data > 0 ? 1.1 : 1 / 1.1;

    event.stopPropagation();
    event.preventDefault();

    this.drawing.updateScale(scale, this.drawing.cursorPosition);
  }
}