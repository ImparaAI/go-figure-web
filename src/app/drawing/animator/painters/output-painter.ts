import { Point2D } from '@app/structures/point';
import { OutputDatum } from '@app/drawing/animator/output';
import { CanvasManager } from '@app/canvas/canvas_manager';

export class OutputPainter {

  protected scale: number = 1;
  protected rgb: string = "0, 168, 232";
  protected numStepsHidden: number = 100;
  protected stepsTransparent: number = 400;
  protected canvasManager: CanvasManager;

  constructor(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
  }

  public paint(output: OutputDatum[], time: number, finalOutput: OutputDatum): void {
    let index: number = this.getStartIndex(time, output),
        value, lastValue;

    for (var step = 0; step < output.length; ++step) {
      value = output[index];

      if (this.shouldDrawLine(step, value, lastValue)) {
        this.canvasManager.setLineWidth(3);
        this.canvasManager.setStrokeStyle(`rgba(${this.rgb}, ${this.getOpacity(step)})`);
        this.canvasManager.paintLine(
          new Point2D(lastValue.point.x, lastValue.point.y),
          new Point2D(value.point.x, value.point.y),
          this.scale
        );
      }

      lastValue = value;
      index = (index + 1) % output.length;
    }

    if (value && value.point && finalOutput) {
      this.canvasManager.setStrokeStyle(`rgba(${this.rgb}, 1)`);
      this.canvasManager.paintLine(
        new Point2D(value.point.x, value.point.y),
        new Point2D(finalOutput.point.x, finalOutput.point.y),
        this.scale
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

  protected getStartIndex(time: number, output: OutputDatum[]): number {
    let finalIndex: number = Math.floor(time / output[1].time);
    return (finalIndex + 1) % output.length;
  }

  public setScale(scale: number): void {
    this.scale = scale;
  }

}