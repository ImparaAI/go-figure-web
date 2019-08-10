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
  loading: boolean = true;

  constructor(private api: ApiService) {
    api.drawingCreated.subscribe((value) => {
      this.load();
    });
  }

  ngOnInit() {
    this.load();
  }

  async load(hideLoading?: boolean) {
    try {
      this.loading = hideLoading ? false : true;
      this.drawings = (await this.api.getRecentDrawings()).map(drawing => new DrawingPreview(drawing));

      setTimeout(()=>{
        this.load(true)
      }, 30000)
    }
    catch (e) {
      this.drawings = [];
    }

    this.loading = false;
  }

}