import { Component, OnInit } from '@angular/core';

import { ApiService } from '@app/api/api.service';
import { DrawingPreview } from '@app/structures/drawing';

@Component({
  selector: 'iai-drawing-recent',
  templateUrl: './drawing-recent.component.html',
  styleUrls: ['./drawing-recent.component.scss']
})
export class DrawingRecentComponent implements OnInit {

  drawings: DrawingPreview[] = [];
  loading: bool = true;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.load();
  }

  async load() {
    try {
      this.loading = true;
      this.drawings = (await this.api.getRecentDrawings()).map(drawing => new DrawingPreview(drawing));
    }
    catch (e) {
      this.drawings = [];
    }

    this.loading = false;
  }

}