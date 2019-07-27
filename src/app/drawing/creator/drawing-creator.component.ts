import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { Point } from '@app/structures/point';
import { Drawing } from '@app/structures/drawing';
import { ApiService } from '@app/api/api.service';
import { CanvasManager } from '@app/structures/canvas_manager';

@Component({
  selector: 'iai-drawing-creator',
  templateUrl: './drawing-creator.component.html',
  styleUrls: ['./drawing-creator.component.scss']
})
export class DrawingCreatorComponent {

  canvasManager: CanvasManager;
  drawing: Drawing = new Drawing;

  constructor(private router: Router, private api: ApiService) { }

  onCanvasReady(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
    this.canvasManager.setLineWidth(1);
    this.canvasManager.setStrokeStyle('black');
  }

  onDrawingUpdated(data: {point: Point, time: number}[]) {
    this.drawing.rawData = data;
  }

  async submit()  {
    try {
      let response = await this.api.createDrawing(this.format());

      this.router.navigate(['drawing', response.id]);
    }
    catch (e) {
      alert('Fail.');
    }
  }

  format() {
    return this.drawing.rawData.map((data) => {
      return {x: data.point.x, y: data.point.y, time: data.time};
    });
  }
}