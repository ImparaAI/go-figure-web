import { ElementRef, Renderer2 } from '@angular/core';

import { Drawing } from '@app/canvas/draggable/drawing';
import { MouseUp } from '@app/canvas/draggable/event-handlers/mouse-up';
import { MouseOut } from '@app/canvas/draggable/event-handlers/mouse-out';
import { TouchEnd } from '@app/canvas/draggable/event-handlers/touch-end';
import { MouseDown } from '@app/canvas/draggable/event-handlers/mouse-down';
import { MouseMove } from '@app/canvas/draggable/event-handlers/mouse-move';
import { TouchMove } from '@app/canvas/draggable/event-handlers/touch-move';
import { TouchStart } from '@app/canvas/draggable/event-handlers/touch-start';
import { MouseWheel } from '@app/canvas/draggable/event-handlers/mouse-wheel';
import { EventHandler } from '@app/canvas/draggable/event-handlers/event-handler';

export class EventRouter {
  protected canvas: ElementRef;
  protected renderer: Renderer2;
  protected drawing: Drawing;
  protected eventHandlerClasses = [MouseUp, MouseOut, TouchEnd, MouseDown, MouseMove, TouchMove, TouchStart, MouseWheel];
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

      handler.getEventNames().forEach((eventName) => {
        this.addListener(handler, eventName);
      });
    });
  }

  addListener(handler: EventHandler, eventName: string) {
    let listener = this.renderer.listen(this.canvas.nativeElement, eventName, (e) => {
      handler.handle(e);
    });

    this.handlerDestroyers.push(listener);
  }

  unregister(): void {
    this.handlerDestroyers.forEach((destroyer) => {
      destroyer();
    });
  }
}