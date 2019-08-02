import { Point3D } from '@app/structures/point';

export class Drawing {
  id: number;
  featured: boolean;
  originalPoints: Point3D[];
  drawVectors: {n: number, real: number, imaginary: number}[];
  image: string;
  createdAt: string;
  lastDrawVectorCalculatedAt: string;
  uri: string;

  constructor(drawing) {
    this.id = drawing.id;
    this.featured = drawing.featured;
    this.originalPoints = drawing.originalPoints.map((op) => new Point3D(op.x, op.y, op.time));
    this.drawVectors = drawing.drawVectors;
    this.image = drawing.image;
    this.createdAt = drawing.createdAt;
    this.lastDrawVectorCalculatedAt = drawing.lastDrawVectorCalculatedAt;
    this.uri = "/drawing/" + this.id;
  }

}