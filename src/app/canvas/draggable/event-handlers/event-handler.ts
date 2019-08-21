import { Drawing } from '@app/canvas/draggable/drawing';

export abstract class EventHandler {
  drawing: Drawing;

  constructor(drawing: Drawing) {
    this.drawing = drawing;
  }

  abstract handle(e: any): void;
  abstract getEventNames(): string[];
}