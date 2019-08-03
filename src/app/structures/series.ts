import { Vector } from '@app/structures/vector';
import { Point2D } from '@app/structures/point';

interface FourierConstant {
  n: number;
  real: number;
  imaginary: number;
}

export class FourierSeries {
  constants: FourierConstant[];
  vectors: Vector[];

  constructor(constants: FourierConstant[]) {
    this.constants = constants;
    this.vectors = this.constants.map(() => new Vector);
  }

  update(time: number, scale: number) {
    this.vectors.forEach((v: Vector, i: number) => {
      let constant = this.constants[i],
          val = 2 * Math.PI * constant.n * time;

      v.start.x = i == 0 ? 0 : this.vectors[i-1].end.x;
      v.start.y = i == 0 ? 0 : this.vectors[i-1].end.y;
      v.end.x = v.start.x + this.getXComponent(time, constant);
      v.end.y = v.start.y + this.getYComponent(time, constant);
    });
  }

  getXComponent(time: number, constant: FourierConstant) {
    let val = this.getCyclicalComponent(constant.n, time);

    return constant.real * Math.cos(val) - constant.imaginary * Math.sin(val);
  }

  getYComponent(time: number, constant: FourierConstant) {
    let val = this.getCyclicalComponent(constant.n, time);

    return constant.real * Math.sin(val) + constant.imaginary * Math.cos(val);
  }

  getCyclicalComponent(n: number, time: number) {
    return 2 * Math.PI * n * time;
  }

  getImageCenterpoint(): Point2D {
    return this.vectors[0].end;
  }

}