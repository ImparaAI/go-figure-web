import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { Point } from '@app/structures/point';
import { ApiService } from '@app/api/api.service';
import { CanvasManager } from '@app/structures/canvas_manager';

@Component({
  selector: 'iai-capturer',
  templateUrl: './capturer.component.html',
  styleUrls: ['./capturer.component.scss']
})
export class CapturerComponent {

  canvasManager: CanvasManager;
  data: {point: Point, time: number}[];

  constructor(private router: Router, private api: ApiService) { }

  onCanvasReady(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
    this.canvasManager.setLineWidth(1);
    this.canvasManager.setStrokeStyle('black');
  }

  onDrawingUpdated(data: {point: Point, time: number}[]) {
    this.data = data;
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
    return this.data.map((data) => {
      return {x: data.point.x, y: data.point.y, time: data.time};
    });
  }
}