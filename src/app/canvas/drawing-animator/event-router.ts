import { ElementRef, Renderer2 } from '@angular/core';

import { Drawing } from '@app/canvas/drawing-animator/drawing';
import { Pinch } from '@app/canvas/drawing-animator/event-handlers/pinch';
import { MouseUp } from '@app/canvas/drawing-animator/event-handlers/mouse-up';
import { MouseOut } from '@app/canvas/drawing-animator/event-handlers/mouse-out';
import { TouchEnd } from '@app/canvas/drawing-animator/event-handlers/touch-end';
import { MouseDown } from '@app/canvas/drawing-animator/event-handlers/mouse-down';
import { MouseMove } from '@app/canvas/drawing-animator/event-handlers/mouse-move';
import { TouchMove } from '@app/canvas/drawing-animator/event-handlers/touch-move';
import { TouchStart } from '@app/canvas/drawing-animator/event-handlers/touch-start';
import { MouseWheel } from '@app/canvas/drawing-animator/event-handlers/mouse-wheel';
import { EventHandler } from '@app/canvas/drawing-animator/event-handlers/event-handler';

export class EventRouter {
  protected canvas: ElementRef;
  protected renderer: Renderer2;
  protected drawing: Drawing;
  protected eventHandlerClasses = [Pinch, MouseUp, MouseOut, TouchEnd, MouseDown, MouseMove, TouchMove, TouchStart, MouseWheel];
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
    let destroyer = this.renderer.listen(this.canvas.nativeElement, eventName, (e) => {
      handler.handle(e);
    });

    this.handlerDestroyers.push(destroyer);
  }

  unregister(): void {
    this.handlerDestroyers.forEach((destroyer) => {
      destroyer();
    });
  }
}