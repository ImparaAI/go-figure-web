import { Point } from '@app/structures/point';
import { Vector } from '@app/structures/vector';

export class Painter {
  scale: number = 1;
  origin: Point = new Point;
  canvas: HTMLCanvasElement;
  brush: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.brush = canvas.getContext('2d');
  }

  clearCanvas() {
    this.brush.clearRect(
      (-this.origin.x - 5000),
      (-this.origin.y - 5000),
      (this.canvas.width * 5000),
      (this.canvas.height * 5000)
    );
  }

  shiftOrigin(deltaX: number, deltaY: number) {
    deltaX = deltaX / this.scale;
    deltaY = deltaY / this.scale;

    this.origin = new Point(this.origin.x + deltaX, this.origin.y + deltaY);
    this.brush.translate(deltaX, deltaY);
  }

  zoom(scale: number) {
    this.scale *= scale;
    this.brush.scale(scale, scale);
  }

  paintPoint(p: Point) {
    this.brush.beginPath();
    this.brush.fillStyle = 'black';
    this.brush.fillRect(p.x, p.y, 1, 1);
    this.brush.closePath();
  }

  paintVectors(vectors: Vector[]) {
    this.brush.beginPath();

    vectors.forEach((v: Vector) => this.paintVector(v));

    this.brush.stroke();
  }

  paintVector(v: Vector) {
    this.paintLine(v.start, v.end);
  }

  paintLine(start: Point, end: Point) {
    this.brush.beginPath();
    this.brush.moveTo(start.x, start.y);
    this.brush.lineTo(end.x, end.y);
    this.brush.stroke();
    this.brush.closePath();
  }

  setStrokeStyle(style: string) {
    this.brush.strokeStyle = style;
  }

  setLineWidth(width: number) {
    this.brush.lineWidth = width;
  }

}