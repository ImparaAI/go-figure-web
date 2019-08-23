import { Point2D } from '@app/structures/point';
import { Drawing } from '@app/canvas/drawing-animator/drawing';
import { EventHandler } from '@app/canvas/drawing-animator/event-handlers/event-handler';

export class PinchStart extends EventHandler {
  constructor(drawing: Drawing) {
    super(drawing);
  }

  public getEventNames(): string[] {
    return ['pinchstart'];
  }

  public handle(e: any): void {
    let pointers = e.pointers.map((pointer) => new Point2D(pointer.x, pointer.y));

    this.drawing.startPinch(pointers);
  }
}