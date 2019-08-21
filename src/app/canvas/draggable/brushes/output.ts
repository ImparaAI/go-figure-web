import { Point2D } from '@app/structures/point';
import { Drawing } from '@app/canvas/draggable/drawing';
import { OutputSeries, OutputDatum } from '@app/canvas/draggable/output-series';

export class OutputBrush {

  protected rgb: string = "0, 168, 232";
  protected numStepsHidden: number = 100;
  protected stepsTransparent: number = 400;
  protected drawing: Drawing;

  constructor(drawing: Drawing) {
    this.drawing = drawing;
  }

  public paint(output: OutputSeries, time: number): void {
    let index: number = this.getStartIndex(time, output),
        value, lastValue;

    for (var step = 0; step < output.data.length; ++step) {
      value = output.data[index];

      if (this.shouldDrawLine(step, value, lastValue)) {
        this.drawing.canvasManager.setLineWidth(3);
        this.drawing.canvasManager.setStrokeStyle(`rgba(${this.rgb}, ${this.getOpacity(step)})`);
        this.drawing.canvasManager.paintLine(
          new Point2D(lastValue.point.x, lastValue.point.y),
          new Point2D(value.point.x, value.point.y)
        );
      }

      lastValue = value;
      index = (index + 1) % output.data.length;
    }

    if (value && value.point && output.finalDataPoint) {
      this.drawing.canvasManager.setStrokeStyle(`rgba(${this.rgb}, 1)`);
      this.drawing.canvasManager.paintLine(
        new Point2D(value.point.x, value.point.y),
        new Point2D(output.finalDataPoint.point.x, output.finalDataPoint.point.y)
      );
    }
  }

  protected shouldDrawLine(step: number, output: OutputDatum, prevOutput: OutputDatum): boolean {
    if (!prevOutput || !prevOutput.point || !output.point)
      return false;

     return step > this.numStepsHidden;
  }

  protected getOpacity(step: number): number {
    return Math.min(1, (step - this.numStepsHidden) / (this.stepsTransparent - this.numStepsHidden))
  }

  protected getStartIndex(time: number, output: OutputSeries): number {
    let finalIndex: number = Math.floor(time / output.data[1].time);
    return (finalIndex + 1) % output.data.length;
  }

}