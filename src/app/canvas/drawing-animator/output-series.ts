import { Point2D } from '@app/structures/point';
import { Drawing } from '@app/canvas/drawing-animator/drawing';

interface OutputDatum {
  time: number;
  point?: Point2D;
  vectorCount?: number;
}

class OutputSeries {
  drawing: Drawing;
  data: OutputDatum[] = [];
  finalDataPoint: OutputDatum;
  timeInterval: number = 0.0005;

  constructor(drawing: Drawing) {
    this.init();
    this.drawing = drawing;
  }

  clear(): void {
    this.data = [];
  }

  init() {
    for (var time = 0; time < 1; time += this.timeInterval) {
      this.data.push({time});
    }
  }

  update(startTime: number, endTime: number) {
    let index = (Math.floor(startTime / this.timeInterval) + 1) % this.data.length,
        finalIndex = Math.floor(endTime / this.timeInterval) % this.data.length;

    //update all skipped outputs due to changing time interval
    while (endTime != startTime && index != finalIndex) {
      this.updateOutputValues(this.data[index]);
      index = (index + 1) % this.data.length;
    }

    //update current output
    this.updateOutputValues(this.data[finalIndex]);
    this.finalDataPoint = {time: endTime, point: this.getOutputPoint(endTime)};
  }

  protected updateOutputValues(output: OutputDatum) {
    if (output.vectorCount == this.drawing.maxVectorCount)
      return;

    Object.assign(output, {
      vectorCount: this.drawing.maxVectorCount,
      point: this.getOutputPoint(output.time),
    });
  }

  protected getOutputPoint(time: number) {
    this.drawing.fourierSeries.update(time);

    let finalVector = this.drawing.fourierSeries.vectors[this.drawing.maxVectorCount - 1];

    return new Point2D(finalVector.end.x, finalVector.end.y);
  }

}


export { OutputSeries, OutputDatum }