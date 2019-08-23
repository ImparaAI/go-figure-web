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

    this.drawing.setScale(this.calculateScale(e), this.calculateCenterpoint(e));
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
}