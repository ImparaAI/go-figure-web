import { EventEmitter } from '@angular/core';
import { Vector } from '@app/structures/vector';
import { Point2D, Point3D } from '@app/structures/point';
import { Painter } from '@app/canvas/drawing-board/painter';
import { InputSeries } from '@app/canvas/drawing-board/input-series';

export class Finalizer {
  painter: Painter;
  inputSeries: InputSeries;
  updateEvent: EventEmitter<Point3D[]>;
  needsFinalizing: boolean;
  running: boolean;
  currentStep: number;
  totalSteps: number = 25;
  centering: boolean;
  connectingLoop: boolean;
  centeringDeltaX: number;
  centeringDeltaY: number;
  drawLimits: {left: number, right: number, top: number, bottom: number};

  constructor(painter: Painter, inputSeries: InputSeries, updateEvent: EventEmitter<Point3D[]>) {
    this.painter = painter;
    this.inputSeries = inputSeries;
    this.updateEvent = updateEvent;
    this.clear();
  }

  clear() {
    this.needsFinalizing = false;
    this.running = false;
    this.currentStep = 0;
    this.centering = false;
    this.connectingLoop = false;
    this.centeringDeltaX = 0;
    this.centeringDeltaY = 0;
    this.drawLimits = undefined;
  }

  finalize() {
    if (this.running || !this.needsFinalizing)
      return;

    this.running = true;
    this.connectLoop();
    this.createCenteringDeltas();
    this.animate();
  }

  animate() {
    if (this.currentStep == this.totalSteps) {
      this.completeAnimation();
      this.painter.paint();
      return;
    }

    if (this.centering) {
      this.translateInputs(this.centeringDeltaX, this.centeringDeltaY);
    }

    this.painter.paint();
    this.currentStep++;

    window.requestAnimationFrame(() => this.animate());
  }

  connectLoop(): boolean {
    if (this.inputSeries.points.length < 3)
      return;

    let firstPoint: Point3D = this.inputSeries.points[0],
        lastPoint: Point3D = this.inputSeries.points[this.inputSeries.points.length - 1],
        distance: number = (new Vector(lastPoint.toPoint2D(), firstPoint.toPoint2D())).length(),
        timeToReachConnection = distance / 500,
        time: number = lastPoint.time + timeToReachConnection;

    this.connectingLoop = true;
    this.inputSeries.points.push(new Point3D(firstPoint.x, firstPoint.y, time));
  }

  createCenteringDeltas() {
    if (!this.drawLimits)
      return;

    let xTranslation: number = (this.painter.canvasManager.element.width - this.drawLimits.right - this.drawLimits.left) / 2,
        yTranslation: number = (this.painter.canvasManager.element.height - this.drawLimits.bottom - this.drawLimits.top) / 2;

    this.centering = true;
    this.centeringDeltaX = xTranslation / this.totalSteps;
    this.centeringDeltaY = yTranslation / this.totalSteps;
  }

  completeAnimation() {
    this.roundInputs();
    this.clear();
    this.updateEvent.emit(this.inputSeries.points);
  }

  translateInputs(deltaX: number, deltaY: number) {
    this.inputSeries.points.forEach((point) => {
      point.update(point.x + deltaX, point.y + deltaY, point.time);
    })
  }

  roundInputs() {
    this.inputSeries.points.forEach((point: Point3D) => {
      point.update(Math.round(point.x), Math.round(point.y), point.time);
    });
  }

  updateDrawLimits(x: number, y: number) {
    this.needsFinalizing = true;

    if (!this.drawLimits) {
      this.drawLimits = {left: x, right: x, top: y, bottom: y};
    }
    else {
      this.drawLimits.left = Math.min(x, this.drawLimits.left);
      this.drawLimits.right = Math.max(x, this.drawLimits.right);
      this.drawLimits.top = Math.max(y, this.drawLimits.top);
      this.drawLimits.bottom = Math.min(y, this.drawLimits.bottom);
    }
  }
}