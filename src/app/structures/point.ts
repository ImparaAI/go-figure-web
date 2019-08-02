class Point2D {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  update(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Point2D {
    return new Point2D(this.x, this.y);
  }

}

class Point3D {
  x: number;
  y: number;
  time: number;

  constructor(x: number = 0, y: number = 0, time: number = 0) {
    this.x = x;
    this.y = y;
    this.time = time;
  }

  update(x: number, y: number, time: number) {
    this.x = x;
    this.y = y;
    this.time = time;
  }

  clone(): Point3D {
    return new Point3D(this.x, this.y, this.time);
  }

  toPoint2D(): Point2D {
    return new Point2D(this.x, this.y);
  }

}

export { Point2D, Point3D }