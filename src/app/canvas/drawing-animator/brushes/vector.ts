import { Point2D } from '@app/structures/point';
import { Vector } from '@app/structures/vector';
import { Drawing } from '@app/canvas/drawing-animator/drawing';

export class VectorsBrush {

  protected rgb: string = "255, 255, 255";
  protected arrowAngle: number = 50;
  protected drawing: Drawing;

  constructor(drawing: Drawing) {
    this.drawing = drawing;
  }

  public paint(vectors: Vector[]): void {
    this.drawing.canvasManager.setLineWidth(1);

    vectors.forEach((v: Vector, i: number) => {
      if (!i)
        return;

      this.drawing.canvasManager.setStrokeStyle(`rgba(${this.rgb}, 1)`);
      this.drawing.canvasManager.paintLine(v.start, v.end);
      this.paintVectorArrow(v, this.arrowAngle / 2);
      this.paintVectorArrow(v, -this.arrowAngle / 2);
      this.paintVectorCircle(v);
    });
  }

  protected paintVectorArrow(v: Vector, rotation: number) {
    let len = v.length() * 0.1,
        angle = v.getReverseVector().direction() + (rotation * Math.PI / 180),
        x = v.end.x + (len * Math.cos(angle)),
        y = v.end.y + (len * Math.sin(angle));

    this.drawing.canvasManager.paintLine(v.end, new Point2D(x, y));
  }

  protected paintVectorCircle(v: Vector) {
    this.drawing.canvasManager.setStrokeStyle(`rgba(255, 255, 255, .05)`);

    this.drawing.canvasManager.paintCircle(v.start, v.length());
  }

}