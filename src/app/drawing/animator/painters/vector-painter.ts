import { Point } from '@app/structures/point';
import { Vector } from '@app/structures/vector';
import { CanvasManager } from '@app/structures/canvas_manager';

export class VectorPainter {

  protected rgb: string;
  protected arrowAngle: number;
  protected canvasManager: CanvasManager;

  constructor(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
    this.rgb = "0, 0, 0";
    this.arrowAngle = 50;
  }

  public paint(vectors: Vector[]): void {
    this.canvasManager.setLineWidth(1);
    this.canvasManager.setStrokeStyle(`rgba(${this.rgb}, 1)`);

    vectors.forEach((v: Vector) => {
      this.canvasManager.paintLine(v.start, v.end);
      this.paintVectorArrow(v, this.arrowAngle / 2);
      this.paintVectorArrow(v, -this.arrowAngle / 2);
    });
  }

  protected paintVectorArrow(v: Vector, rotation: number) {
    let len = v.length() * 0.1,
        angle = v.getReverseVector().direction() + (rotation * Math.PI / 180),
        x = v.end.x + len * Math.cos(angle),
        y = v.end.y + len * Math.sin(angle);

    this.canvasManager.paintLine(v.end, new Point(x, y));
  }

}