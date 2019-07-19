import { Vector } from '@app/structures/vector';

export class FourierSeries {
  constants: {n: number, real: number, imaginary: number}[];
  vectors: Vector[];

  constructor(constants: {n: number, real: number, imaginary: number}[]) {
    this.constants = constants;
    this.vectors = this.constants.map(() => new Vector);
  }

  update(time: number) {
    this.vectors.forEach((v: Vector, i: number) => {
      let constant = this.constants[i],
          val = 2 * Math.PI * constant.n * time;

      v.start.x = i == 0 ? 0 : this.vectors[i-1].end.x;
      v.start.y = i == 0 ? 0 : this.vectors[i-1].end.y;
      v.end.x = v.start.x + this.getXComponent(time, constant);
      v.end.y = v.start.y + this.getYComponent(time, constant);
    });
  }

  getXComponent(time: number, constant: {n: number, real: number, imaginary: number}) {
    let val = this.getCyclicalComponent(constant.n, time);

    return constant.real * Math.cos(val) - constant.imaginary * Math.sin(val);
  }

  getYComponent(time: number, constant: {n: number, real: number, imaginary: number}) {
    let val = this.getCyclicalComponent(constant.n, time);

    return constant.real * Math.sin(val) + constant.imaginary * Math.cos(val);
  }

  getCyclicalComponent(n: number, time: number) {
    return 2 * Math.PI * n * time;
  }

}