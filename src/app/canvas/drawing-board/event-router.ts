import { Drawing } from '@app/canvas/drawing-board/drawing';
import { MouseUp } from '@app/canvas/drawing-board/event-handlers/mouse-up';
import { MouseOut } from '@app/canvas/drawing-board/event-handlers/mouse-out';
import { TouchEnd } from '@app/canvas/drawing-board/event-handlers/touch-end';
import { MouseDown } from '@app/canvas/drawing-board/event-handlers/mouse-down';
import { MouseMove } from '@app/canvas/drawing-board/event-handlers/mouse-move';
import { TouchMove } from '@app/canvas/drawing-board/event-handlers/touch-move';
import { TouchStart } from '@app/canvas/drawing-board/event-handlers/touch-start';
import { TouchCancel } from '@app/canvas/drawing-board/event-handlers/touch-cancel';
import { EventHandler } from '@app/canvas/drawing-board/event-handlers/event-handler';

export class EventRouter {
  protected drawing: Drawing;
  protected eventHandlerClasses = [MouseDown, MouseMove, MouseOut, MouseUp, TouchStart, TouchMove, TouchEnd, TouchCancel];

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