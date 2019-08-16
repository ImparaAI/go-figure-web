import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, OnInit, HostListener } from '@angular/core';

import { Vector } from '@app/structures/vector';
import { Point3D } from '@app/structures/point';
import { CanvasManager } from '@app/canvas/canvas_manager';
import { Drawing } from '@app/canvas/drawing-board/drawing';
import { EventRouter } from '@app/canvas/drawing-board/event-router';
import { InputSeries } from '@app/canvas/drawing-board/input-series';

@Component({
  selector: 'iai-drawing-board',
  templateUrl: './drawing-board.component.html',
  styleUrls: ['./drawing-board.component.scss']
})
export class DrawingBoardComponent implements OnInit {
  canvasManager: CanvasManager;
  drawing: Drawing;
  eventRouter: EventRouter;
  inputSeries: InputSeries = new InputSeries;

  @Input() height: number;
  @Input() width: number;
  @ViewChild('canvas') canvas: ElementRef;
  @Output() drawingUpdated = new EventEmitter<Point3D[]>();
  @Output() canvasInitialized = new EventEmitter<CanvasManager>();

  ngOnInit() {
    if (this.width === undefined || this.height === undefined) {
      throw new Error("A valid width and height need to be provided to the drawing board.")
    }
  }

  ngAfterViewInit() {
    this.canvasManager = new CanvasManager(this.canvas.nativeElement);
    this.drawing = new Drawing(this.canvasManager, this.inputSeries, this.drawingUpdated);
    this.eventRouter = new EventRouter(this.drawing);
    this.canvasInitialized.emit(this.canvasManager);
  }

  @HostListener('document:touchstart', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  stopTouchScrollOnCanvas(event) {
    if (event.target === this.canvasManager.element)
      event.preventDefault();
  }

  shouldShowCountdown() {
    return !!this.drawing && this.drawing.cursorPressed;
  }
}