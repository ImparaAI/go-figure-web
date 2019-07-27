import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { Point } from '@app/structures/point';
import { CanvasManager } from '@app/structures/canvas_manager';

@Component({
  selector: 'iai-draggable-canvas',
  templateUrl: './draggable-canvas.component.html',
})
export class DraggableCanvasComponent {

  dragStart: Point;
  mouseIsDown: boolean;
  canvasManager: CanvasManager;

  @ViewChild('canvas') canvas: ElementRef;
  @Output() canvasInitialized = new EventEmitter<any>();

  ngAfterViewInit() {
    this.bindDragEvents();
    this.canvasManager = new CanvasManager(this.canvas.nativeElement);
    this.canvasInitialized.emit(this.canvasManager);
  }

  bindDragEvents() {
    this.canvas.nativeElement.addEventListener("mousemove", (e) => {
        this.mousemove(e.layerX, e.layerY)
    }, false);
    this.canvas.nativeElement.addEventListener("mousedown", (e) => {
        this.mousedown(e.layerX, e.layerY);
    }, false);
    this.canvas.nativeElement.addEventListener("mouseup", (e) => {
        this.mouseup();
    }, false);
    this.canvas.nativeElement.addEventListener("mouseout", (e) => {
        this.mouseup();
    }, false);

    if (this.canvas.nativeElement.addEventListener) {
      this.canvas.nativeElement.addEventListener("wheel", (e) => this.handleMousescroll(e), false);
      this.canvas.nativeElement.addEventListener("DOMMouseScroll", (e) => this.handleMousescroll(e), false);
    }
    else
      this.canvas.nativeElement.attachEvent("onmousewheel", (e) => this.handleMousescroll(e));
  }

  handleMousescroll(e): boolean {
    e = window.event || e;
    e.stopPropagation();
    event.preventDefault();
    this.mousescroll(e.wheelDelta || -e.detail);

    return false;
  }

  mousescroll(pixles: number) {
    let val = pixles > 0 ? 1.1 : 0.9;

    this.canvasManager.zoom(val);
  }

  mousemove(x, y) {
    if (!this.mouseIsDown)
      return;

    let deltaX = x - this.dragStart.x,
        deltaY = y - this.dragStart.y;

    if (deltaX || deltaY) {
      this.canvasManager.shiftOrigin(deltaX, deltaY)
      this.dragStart = new Point(x, y);
    }
  }

  mouseup() {
    this.mouseIsDown = false;
  }

  mousedown(x, y) {
    this.mouseIsDown = true;
    this.dragStart = new Point(x, y);
  }

}
