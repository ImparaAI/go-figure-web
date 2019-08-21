import { Point3D } from '@app/structures/point';

class DrawingPreview {
  id: number;
  uri: string;
  svgPath: string;

  constructor(drawing) {
    this.id = drawing.id;
    this.svgPath = drawing.svgPath;
    this.uri = "/drawing/" + this.id;
  }
}

export { DrawingPreview }