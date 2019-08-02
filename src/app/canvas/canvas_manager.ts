import { Point } from '@app/structures/point';

export class CanvasManager {
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

  centerOn(point: Point) {
    let center = new Point(this.element.width / 2, this.element.height / 2);
    this.setOrigin(center.x - point.x, center.y - point.y);
  }

  setOrigin(x: number, y: number) {
    let deltaX = x - this.origin.x,
        deltaY = y - this.origin.y;

    this.origin = new Point(this.origin.x + deltaX, this.origin.y + deltaY);
    this.drawer.translate(deltaX, deltaY);
  }

  shiftOrigin(deltaX: number, deltaY: number) {
    this.origin = new Point(this.origin.x + deltaX, this.origin.y + deltaY);
    this.drawer.translate(deltaX, deltaY);
  }

  paintPoint(p: Point, scale: number = 1) {
    this.drawer.beginPath();
    this.drawer.fillStyle = 'black';
    this.drawer.fillRect(p.x * scale, p.y * scale, 1, 1);
    this.drawer.closePath();
  }

  paintLine(start: Point, end: Point, scale: number = 1) {
    this.drawer.beginPath();
    this.drawer.moveTo(start.x * scale, start.y * scale);
    this.drawer.lineTo(end.x * scale, end.y * scale);
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