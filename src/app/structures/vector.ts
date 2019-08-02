import { Point2D } from '@app/structures/point';

export class Vector {
  start: Point2D = new Point2D;
  end: Point2D = new Point2D;

  length(): number {
    return Math.sqrt(Math.pow(this.end.x - this.start.x, 2) + Math.pow(this.end.y - this.start.y, 2));
  }

  direction(): number {
    let angle = Math.atan((this.end.y - this.start.y)/(this.end.x - this.start.x));

    if (this.end.x < this.start.x)
      angle += Math.PI;

    return angle;
  }

  getReverseVector(): Vector {
    let v = new Vector;

    v.start = this.end;
    v.end = this.start;

    return v;
  }
}