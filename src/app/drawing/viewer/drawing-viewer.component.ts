import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { ApiService } from '@app/api/api.service';
import { Drawing } from '@app/canvas/drawing-animator/drawing';

@Component({
  selector: 'iai-drawing-viewer',
  templateUrl: './drawing-viewer.component.html',
  styleUrls: ['./drawing-viewer.component.scss']
})
export class DrawingViewerComponent implements OnInit, OnDestroy {

  id: number;
  drawing: Drawing;
  loading: boolean = true;
  longPollTimeout: NodeJS.Timer;
  minTimeInterval: number = 0.0001;
  displayVectorCount: number = 0;

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) {
    router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.load();
  }

  ngOnDestroy() {
    if (this.longPollTimeout)
      clearTimeout(this.longPollTimeout)
  }

  onCanvasReady(drawing: Drawing) {
    this.drawing = drawing;
  }

  async load() {
    let drawingData;

    try {
      drawingData = await this.api.getDrawing(this.id);
    }
    catch (e) {
      this.router.navigateByUrl('404', {skipLocationChange: true});
    }
    finally {
      if (!drawingData.drawVectors.length) {
        this.loading = false;

        this.longPollTimeout = setTimeout(()=>{
          this.load();
        }, 1000)
      }
      else {
        this.setVectorCount(drawingData.drawVectors.length);
        this.drawing.setData(drawingData.drawVectors, drawingData.originalPoints);
        this.loading = false;
        this.drawing.animator.start();
      }
    }
  }

  setVectorCount(count: number) {
    this.drawing.maxVectorCount = count;
    this.displayVectorCount = count - 1;
  }

  resetZoomAndSpeed() {
    this.drawing.animator.timeInterval = 0.005;
    this.drawing.animator.trackOutput = false;
    this.drawing.setScale(1);
    this.drawing.canvasManager.setOrigin(0, 0);
  }

  zoomInAndSlow() {
    this.drawing.animator.timeInterval = this.calculateSlowTimeInterval();
    this.drawing.animator.trackOutput = true;
    this.drawing.setScale(this.drawing.maxVectorCount / 2.5);
  }

  calculateSlowTimeInterval() {
    if (this.drawing.maxVectorCount < 40)
      return 0.0003;
    else if (this.drawing.maxVectorCount < 80)
      return 0.0002;
    else
      return this.minTimeInterval;
  }

}