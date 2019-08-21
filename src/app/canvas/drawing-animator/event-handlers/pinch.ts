import { Point2D } from '@app/structures/point';
import { Drawing } from '@app/canvas/drawing-animator/drawing';
import { EventHandler } from '@app/canvas/drawing-animator/event-handlers/event-handler';

export class Pinch extends EventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventNames(): string[] {
    return ['pinchin', 'pinchout'];
  }

  public handle(e: any): void {
    this.drawing.scaleBy(e.scale, new Point2D(e.center.x, e.center.y));
  }
}