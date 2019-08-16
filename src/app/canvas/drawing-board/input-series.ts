import { Point3D } from '@app/structures/point';

export class InputSeries {
  points: Point3D[] = [];

  addPoint(point: Point3D): void {
    this.points.push(point);
  }

  clear(): void {
    this.points = [];
  }
}