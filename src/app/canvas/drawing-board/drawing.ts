import { EventEmitter } from '@angular/core';
import { Point3D } from '@app/structures/point';
import { CanvasManager } from '@app/canvas/canvas_manager';
import { Painter } from '@app/canvas/drawing-board/painter';
import { Finalizer } from '@app/canvas/drawing-board/finalizer';
import { InputSeries } from '@app/canvas/drawing-board/input-series';

export class Drawing {
  canvasManager: CanvasManager;
  inputSeries: InputSeries;
  painter: Painter;
  finalizer: Finalizer;
  updateEvent: EventEmitter<Point3D[]>;
  cursorPressed: boolean = false;
  timestamp: number;
  secondsLeft: number;

  constructor(canvasManager: CanvasManager, inputSeries: InputSeries, updateEvent: EventEmitter<Point3D[]>) {
    this.canvasManager = canvasManager;
    this.inputSeries = inputSeries;
    this.updateEvent = updateEvent;
    this.painter = new Painter(this, this.canvasManager, this.inputSeries);
    this.finalizer = new Finalizer(this.painter, this.inputSeries, this.updateEvent);
  }

  finish(): void {
    this.finalizer.finalize();
    this.updateEvent.emit(this.inputSeries.points);
  }

  addPoint(x: number, y: number): void {
    let time = this.inputSeries.points.length ? (Date.now() - this.timestamp) / 1000 : 0.00;

    this.inputSeries.addPoint(new Point3D(x, y, time));
    this.finalizer.updateDrawLimits(x, y);
    this.updateEvent.emit(this.inputSeries.points);
    this.painter.paint();
  }

  clear(): void {
    this.inputSeries.clear();
    this.painter.clear();
    this.timestamp = Date.now();
    this.secondsLeft = 6;
    this.updateEvent.emit(this.inputSeries.points);
  }

  pressCursor(): void {
    this.cursorPressed = true;

    this.countdownTick();
  }

  liftCursor(): void {
    this.cursorPressed = false;
  }

  countdownTick() {
    if (!this.cursorPressed)
      return;

    if (!this.secondsLeft) {
      this.liftCursor();
      this.finish();
      return;
    }

    this.secondsLeft--;

    setTimeout(()=>{
      this.countdownTick()
    }, 1000)
  }
}