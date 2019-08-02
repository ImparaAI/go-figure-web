import { Point } from '@app/structures/point';
import { CanvasManager } from '@app/structures/canvas_manager';

export class OutputPainter {

  protected scale: number = 1;
  protected rgb: string ="255, 165, 0";
  protected numStepsHidden: number = 100;
  protected stepsTransparent: number = 400;
  protected canvasManager: CanvasManager;

  constructor(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
  }

  public paint(output, time: number): void {
    let index: number = this.getStartIndex(time, output),
        value, lastValue;

    for (var step = 0; step < output.length; ++step) {
      value = output[index];

      if (this.shouldDrawLine(step, value, lastValue)) {
        this.canvasManager.setLineWidth(3);
        this.canvasManager.setStrokeStyle(`rgba(${this.rgb}, ${this.getOpacity(step)})`);
        this.canvasManager.paintLine(
          new Point(lastValue.point.x, lastValue.point.y),
          new Point(value.point.x, value.point.y),
          this.scale
        );
      }

      lastValue = value;
      index = (index + 1) % output.length;
    }
  }

  protected shouldDrawLine(step: number, output: {point?: Point}, prevOutput: {point?: Point}): boolean {
    if (!prevOutput || !prevOutput.point || !output.point)
      return false;

     return step > this.numStepsHidden;
  }

  protected getOpacity(step: number): number {
    return Math.min(1, (step - this.numStepsHidden) / (this.stepsTransparent - this.numStepsHidden))
  }

  protected getStartIndex(time: number, output): number {
    let finalIndex: number = Math.round(time / output[1].t);
    return (finalIndex + 1) % output.length;
  }

  public setScale(scale: number): void {
    this.scale = scale;
  }

}