import { Point2D } from '@app/structures/point';
import { Drawing } from '@app/canvas/draggable/drawing';
import { EventHandler } from '@app/canvas/draggable/event-handlers/event-handler';

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