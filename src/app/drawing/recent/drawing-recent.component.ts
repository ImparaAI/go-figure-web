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
    }
    catch (e) {

    }
  }

}