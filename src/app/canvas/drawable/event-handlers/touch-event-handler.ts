import { Drawing } from '@app/canvas/drawable/drawing';
import { EventHandler } from '@app/canvas/drawable/event-handlers/event-handler';

export abstract class TouchEventHandler extends EventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  getPosition(event: TouchEvent): {x: number, y: number} {
    let element: HTMLElement = event.target as HTMLElement,
        boundingRectangle: ClientRect = element.getBoundingClientRect();

    return {
      x: event.touches[0].clientX - boundingRectangle.left,
      y: event.touches[0].clientY - boundingRectangle.top
    }
  }
}