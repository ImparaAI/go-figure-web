import { Drawing } from '@app/canvas/drawing-board/drawing';

export abstract class EventHandler {
  drawing: Drawing;

  constructor(drawing: Drawing) {
    this.drawing = drawing;
  }

  abstract handle(e: any): void;
  abstract getEventName(): string;
}