import { Drawing } from '@app/canvas/drawable/drawing';
import { EventHandler } from '@app/canvas/drawable/event-handlers/event-handler';

export abstract class TouchEventHandler extends EventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  getPosition(e: TouchEvent): {x: number, y: number} {
    let boundingRectangle = e.target.getBoundingClientRect();

    return {
      x: e.touches[0].clientX - boundingRectangle.left,
      y: e.touches[0].clientY - boundingRectangle.top
    }
  }
}