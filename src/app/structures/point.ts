class Point2D {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  update(x: number, y: number): Point2D {
    this.x = x;
    this.y = y;

    return this;
  }

  scale(scale: number): Point2D {
    this.x *= scale;
    this.y *= scale;

    return this;
  }

  shift(x: number, y: number): Point2D {
    this.x += x;
    this.y += y;

    return this;
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

  update(x: number, y: number, time: number): Point3D {
    this.x = x;
    this.y = y;
    this.time = time;

    return this;
  }

  clone(): Point3D {
    return new Point3D(this.x, this.y, this.time);
  }

  shift(deltaX: number, deltaY: number, deltaT: number): Point3D {
    this.x += deltaX
    this.y += deltaY;
    this.time += deltaT;

    return this;
  }

  toPoint2D(): Point2D {
    return new Point2D(this.x, this.y);
  }

}

export { Point2D, Point3D }