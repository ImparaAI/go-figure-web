import { Point } from '@app/structures/point';

export class Drawing {
  id: number
  featured: boolean;
  calculatedDrawVectorCount: number;
  lastDrawVectorCalculatedAt: string
  originalPoints: {x: number, y: number, time: number}[];
  drawVectors: {n: number, real: number, imaginary: number}[];
  createdAt: string;

  constructor(drawing) {
    this.id = drawing.id;
    this.featured = drawing.featured;
    this.createdAt = drawing.createdAt;
    this.drawVectors = drawing.drawVectors;
    this.originalPoints = drawing.originalPoints;
    this.calculatedDrawVectorCount = drawing.calculatedDrawVectorCount;
    this.lastDrawVectorCalculatedAt = drawing.lastDrawVectorCalculatedAt;
  }

}