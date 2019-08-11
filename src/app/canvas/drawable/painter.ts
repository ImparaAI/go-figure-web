import { Drawing } from '@app/canvas/drawable/drawing';
import { Point2D, Point3D } from '@app/structures/point';
import { CanvasManager } from '@app/canvas/canvas_manager';
import { DataBrush } from '@app/canvas/drawable/brushes/data';
import { InputSeries } from '@app/canvas/drawable/input-series';
import { CursorBrush } from '@app/canvas/drawable/brushes/cursor';

export class Painter {
  drawing: Drawing;
  canvasManager: CanvasManager;
  inputSeries: InputSeries;
  protected mouseOutsideCanvas: boolean = true;
  protected cursorPosition: Point2D;
  protected brushes: {
    data: DataBrush;
    cursor: CursorBrush;
  }

  constructor(drawing: Drawing, canvasManager: CanvasManager, inputSeries: InputSeries) {
    this.drawing = drawing;
    this.canvasManager = canvasManager;
    this.inputSeries = inputSeries;

    this.brushes = {
      data: new DataBrush(drawing),
      cursor: new CursorBrush(drawing),
    };
  }

  paint(): void {
    this.canvasManager.clearCanvas();

    if (this.inputSeries.points)
      this.brushes.data.paint(this.inputSeries.points);

    if (this.cursorPosition && !this.mouseOutsideCanvas && !this.drawing.finalizer.running)
      this.brushes.cursor.paint(this.cursorPosition);
  }

  mouseOutside(): void {
    this.mouseOutsideCanvas = true;
  }

  mouseInside(): void {
    this.mouseOutsideCanvas = false;
  }

  setCursorPosition(point: Point2D): void {
    this.cursorPosition = point;
  }

  clear() {
    this.canvasManager.clearCanvas();
  }
}