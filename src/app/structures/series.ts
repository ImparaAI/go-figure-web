import { Vector } from '@app/structures/vector';

export class FourierSeries {
  params: {n: number, c: number}[];
  vectors: Vector[];

  constructor(params: {n: number, c: number}[]) {
    this.params = params;
    this.vectors = this.params.map(() => new Vector);
  }

  update(time: number) {
    this.vectors.forEach((v: Vector, i: number) => {
      let params = this.params[i],
          val = 2 * Math.PI * params.n * time;

      v.start.x = i == 0 ? 0 : this.vectors[i-1].end.x;
      v.start.y = i == 0 ? 0 : this.vectors[i-1].end.y;
      v.end.x = v.start.x + params.c * Math.cos(val);
      v.end.y = v.start.y + params.c * Math.sin(val);
    });
  }

}