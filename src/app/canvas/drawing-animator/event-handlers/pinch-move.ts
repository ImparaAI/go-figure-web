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

    let scale = (e.scale - 1) / 1.5 + 1;

    this.drawing.setScale(this.drawing.pinchStartScale * scale, new Point2D(e.center.x, e.center.y));

    this.drawing.log = JSON.stringify(e);
  }
}