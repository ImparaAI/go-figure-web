import { Point2D } from '@app/structures/point';
import { Drawing } from '@app/canvas/drawing-animator/drawing';
import { EventHandler } from '@app/canvas/drawing-animator/event-handlers/event-handler';

export class PinchMove extends EventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventNames(): string[] {
    return ['pinchin', 'pinchout'];
  }

  public handle(e: any): void {
    if (!this.drawing.pinchStartScale)
      return;

    this.scale(e)
    this.pan(e);
  }

  protected scale(e: any): void {
    let scale = this.calculateScale(e),
        centerpoint = this.calculateCenterpoint(e);

    this.drawing.setScale(scale, centerpoint);
  }

  protected calculateScale(e: any): number {
    let adjustedScaleFactor: number = (e.scale - 1) / 1.3 + 1;

    return this.drawing.pinchStartScale * adjustedScaleFactor;
  }

  protected calculateCenterpoint(e: any): Point2D {
    let parentDimensions: DOMRect = this.drawing.canvasManager.element.parentElement.getBoundingClientRect() as DOMRect,
        x: number = e.center.x - parentDimensions.x - this.drawing.canvasManager.element.offsetLeft,
        y: number = e.center.y - parentDimensions.y;

    return new Point2D(x, y);
  }

  protected pan(e: any): void {
    let pointers = e.pointers.map((pointer) => new Point2D(pointer.x, pointer.y)),
        deltas = e.pointers.map((pointer, i) =>  new Point2D(pointer.x - this.drawing.pointers[i].x, pointer.y - this.drawing.pointers[i].y)),
        deltaX = deltas.reduce((total, current) => total + current.x, 0) / e.pointers.length,
        deltaY = deltas.reduce((total, current) => total + current.y, 0) / e.pointers.length;

    if (deltaX || deltaY) {
      this.drawing.canvasManager.shiftOrigin(deltaX, deltaY);
    }

    this.drawing.pointers = pointers;
  }
}