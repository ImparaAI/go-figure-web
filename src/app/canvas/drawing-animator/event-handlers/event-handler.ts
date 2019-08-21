import { Drawing } from '@app/canvas/drawing-animator/drawing';

export abstract class EventHandler {
  drawing: Drawing;

  constructor(drawing: Drawing) {
    this.drawing = drawing;
  }

  abstract handle(e: any): void;
  abstract getEventNames(): string[];
}