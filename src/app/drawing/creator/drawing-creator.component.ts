import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { Point3D } from '@app/structures/point';
import { ApiService } from '@app/api/api.service';
import { CanvasManager } from '@app/canvas/canvas_manager';

@Component({
  selector: 'iai-drawing-creator',
  templateUrl: './drawing-creator.component.html',
  styleUrls: ['./drawing-creator.component.scss']
})
export class DrawingCreatorComponent {

  data: Point3D[];

  constructor(private router: Router, private api: ApiService) { }

  onDrawingUpdated(data: Point3D[]) {
    this.data = data;
  }

  async submit()  {
    try {
      let response = await this.api.createDrawing(this.format());

      this.router.navigate(['drawing', response.id]);
    }
    catch (e) {
      alert('Something went wrong...please reload the page and try again!');
    }
  }

  format() {
    return this.data.map((point) => {
      return {x: point.x, y: point.y, time: point.time};
    });
  }
}