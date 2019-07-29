import { Point } from '@app/structures/point';
import { Vector } from '@app/structures/vector';

export class CanvasManager {
  scale: number = 1;
  origin: Point = new Point;
  element: HTMLCanvasElement;
  drawer: CanvasRenderingContext2D;

  constructor(element: HTMLCanvasElement) {
    this.element = element;
    this.drawer = element.getContext('2d');
  }

  getNativeElement(): HTMLCanvasElement {
    return this.element
  }

  clearCanvas() {
    this.drawer.clearRect(
      (-this.origin.x - 5000),
      (-this.origin.y - 5000),
      (this.element.width * 5000),
      (this.element.height * 5000)
    );
  }

  shiftOrigin(deltaX: number, deltaY: number) {
    deltaX = deltaX / this.scale;
    deltaY = deltaY / this.scale;

    this.origin = new Point(this.origin.x + deltaX, this.origin.y + deltaY);
    this.drawer.translate(deltaX, deltaY);
  }

  zoom(scale: number) {
    this.scale *= scale;
    this.drawer.scale(scale, scale);
  }

  paintPoint(p: Point) {
    this.drawer.beginPath();
    this.drawer.fillStyle = 'black';
    this.drawer.fillRect(p.x, p.y, 1, 1);
    this.drawer.closePath();
  }

  paintVectors(vectors: Vector[]) {
    this.drawer.beginPath();

    vectors.forEach((v: Vector) => this.paintVector(v));

    this.drawer.stroke();
  }

  paintVector(v: Vector) {
    this.paintLine(v.start, v.end);
  }

  paintLine(start: Point, end: Point) {
    this.drawer.beginPath();
    this.drawer.moveTo(start.x, start.y);
    this.drawer.lineTo(end.x, end.y);
    this.drawer.stroke();
    this.drawer.closePath();
  }

  setStrokeStyle(style: string) {
    this.drawer.strokeStyle = style;
  }

  setLineWidth(width: number) {
    this.drawer.lineWidth = width;
  }

  getPng() {
    return this.element.toDataURL();
  }

}