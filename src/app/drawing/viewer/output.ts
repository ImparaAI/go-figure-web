import { Point2D } from '@app/structures/point';

export interface OutputDatum {
  time: number;
  point?: Point2D;
  vectorCount?: number;
}