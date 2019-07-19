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
      (0 - this.origin.x) / this.scale,
      (0 - this.origin.y) / this.scale,
      this.canvas.width / this.scale,
      this.canvas.height / this.scale);
  }

  shiftOrigin(deltaX: number, deltaY: number) {
    this.origin = new Point(this.origin.x + deltaX * this.scale, this.origin.y + deltaY * this.scale);
    this.brush.translate(deltaX, deltaY);
  }

  zoom(scale: number) {
    this.scale *= scale
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