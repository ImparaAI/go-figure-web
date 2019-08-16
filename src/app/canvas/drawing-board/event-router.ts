import { ElementRef, Renderer2 } from '@angular/core';

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
  protected canvas: ElementRef;
  protected renderer: Renderer2;
  protected drawing: Drawing;
  protected eventHandlerClasses = [MouseDown, MouseMove, MouseOut, MouseUp, TouchStart, TouchMove, TouchEnd, TouchCancel];
  protected handlerDestroyers: (() => void)[] = [];

  constructor(canvas: ElementRef, renderer: Renderer2, drawing: Drawing) {
    this.canvas = canvas;
    this.renderer = renderer;
    this.drawing = drawing;

    this.route();
  }

  route(): void {
    this.eventHandlerClasses.forEach((className) => {
      let handler = new className(this.drawing);

      this.handlerDestroyers.push(this.renderer.listen(this.canvas.nativeElement, handler.getEventName(), (e) => {
          handler.handle(e);
      }));
    });
  }

  unregister(): void {
    this.handlerDestroyers.forEach((destroyer) => {
      destroyer();
    });
  }
}