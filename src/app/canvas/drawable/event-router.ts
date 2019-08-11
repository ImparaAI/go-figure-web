import { Drawing } from '@app/canvas/drawable/drawing';
import { MouseUp } from '@app/canvas/drawable/event-handlers/mouse-up';
import { MouseOut } from '@app/canvas/drawable/event-handlers/mouse-out';
import { MouseDown } from '@app/canvas/drawable/event-handlers/mouse-down';
import { MouseMove } from '@app/canvas/drawable/event-handlers/mouse-move';
import { EventHandler } from '@app/canvas/drawable/event-handlers/event-handler';

export class EventRouter {
  protected drawing: Drawing;
  protected eventHandlerClasses = [MouseDown, MouseMove, MouseOut, MouseUp];

  constructor(drawing: Drawing) {
    this.drawing = drawing;

    this.route();
  }

  public route(): void {
    this.eventHandlerClasses.forEach((className) => {
      let handler = new className(this.drawing);

      this.drawing.canvasManager.element.addEventListener(handler.getEventName(), (e) => {
          handler.handle(e);
      }, false);
    });
  }
}