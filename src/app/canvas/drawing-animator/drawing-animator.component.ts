import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, OnInit, OnDestroy, Renderer2 } from '@angular/core';

import { Point2D } from '@app/structures/point';
import { CanvasManager } from '@app/canvas/canvas_manager';
import { Drawing } from '@app/canvas/drawing-animator/drawing';
import { EventRouter } from '@app/canvas/drawing-animator/event-router';

@Component({
  selector: 'iai-drawing-animator',
  templateUrl: './drawing-animator.component.html',
  styleUrls: ['./drawing-animator.component.scss']
})
export class DrawingAnimatorComponent implements OnInit, OnDestroy {

  drawing: Drawing;
  eventRouter: EventRouter;
  canvasManager: CanvasManager;

  @Input() width: number;
  @Input() height: number;
  @ViewChild('canvas') canvas: ElementRef;
  @Output() canvasInitialized = new EventEmitter<Drawing>();

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    if (this.width === undefined || this.height === undefined) {
      throw new Error("A valid width and height need to be provided to the drawing animator.")
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.canvasManager = new CanvasManager(this.canvas.nativeElement);
      this.drawing = new Drawing(this.canvasManager);
      this.eventRouter = new EventRouter(this.canvas, this.renderer, this.drawing);
      this.canvasInitialized.emit(this.drawing);
    });
  }

  ngOnDestroy() {
    if (this.eventRouter)
      this.eventRouter.unregister();

    if (this.drawing)
      this.drawing.animator.stop();
  }

}