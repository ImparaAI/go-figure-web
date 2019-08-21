import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, OnInit, OnDestroy, Renderer2 } from '@angular/core';

import { Point2D } from '@app/structures/point';
import { Drawing } from '@app/canvas/draggable/drawing';
import { CanvasManager } from '@app/canvas/canvas_manager';
import { EventRouter } from '@app/canvas/draggable/event-router';

@Component({
  selector: 'iai-draggable-canvas',
  templateUrl: './draggable-canvas.component.html',
  styleUrls: ['./draggable-canvas.component.scss']
})
export class DraggableCanvasComponent implements OnInit, OnDestroy {

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
      throw new Error("A valid width and height need to be provided to the draggable canvas.")
    }
  }

  ngAfterViewInit() {
    this.canvasManager = new CanvasManager(this.canvas.nativeElement);
    this.drawing = new Drawing(this.canvasManager);
    this.eventRouter = new EventRouter(this.canvas, this.renderer, this.drawing);
    this.canvasInitialized.emit(this.drawing);
  }

  ngOnDestroy() {
    if (this.eventRouter)
      this.eventRouter.unregister();
  }

}