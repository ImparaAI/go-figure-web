import { Drawing } from '@app/canvas/draggable/drawing';
import { CanvasManager } from '@app/canvas/canvas_manager';

export class Painter {
  drawing: Drawing;
  canvasManager: CanvasManager;

  constructor(drawing: Drawing, canvasManager: CanvasManager) {
    this.drawing = drawing;
    this.canvasManager = canvasManager;
  }

  paint(): void {

  }

}