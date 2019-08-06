import { Component, OnInit } from '@angular/core';

import { Drawing } from '@app/structures/drawing';
import { ApiService } from '@app/api/api.service';

@Component({
  selector: 'iai-drawing-recent',
  templateUrl: './drawing-recent.component.html',
  styleUrls: ['./drawing-recent.component.scss']
})
export class DrawingRecentComponent implements OnInit {

  drawings: Drawing[] = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.load();
  }

  async load() {
    try {
      let rawDrawings = await this.api.getRecentDrawings();

      this.drawings = rawDrawings.map(drawing => {return new Drawing(drawing)});
      this.drawings.forEach(drawing => drawing.svgPath = this.buildSvgPath(drawing));
    }
    catch (e) {

    }
  }

  buildSvgPath(drawing: Drawing): string {
    let path = "";

    drawing.originalPoints.forEach((point, i) => {

      if (i == 0)
        path += `M ${point.x} ${point.y} `;
      else
        path += `L ${point.x} ${point.y} `;
    });

    return path;
  }

}