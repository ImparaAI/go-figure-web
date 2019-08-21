import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@app/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';

import { ApiService } from '@app/api/api.service';
import { Point2D, Point3D } from '@app/structures/point';
import { PatchedGestureConfig } from '@app/gesture-config';
import { DrawingViewerComponent } from '../drawing-viewer.component';
import { DrawingAnimatorComponent } from '@app/canvas/drawing-animator/drawing-animator.component';

describe('DrawingViewerComponent', () => {
  let component: DrawingViewerComponent,
      fixture: ComponentFixture<DrawingViewerComponent>,
      canvas: DebugElement,
      apiService = jasmine.createSpyObj('ApiService', ['getDrawing']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DrawingViewerComponent,
        DrawingAnimatorComponent
      ],
      imports: [
        FormsModule,
        MaterialModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        {provide: ApiService, useValue: apiService},
        {provide: ActivatedRoute, useValue: {snapshot: {paramMap: {get: () => 23}}}},
        {provide: HAMMER_GESTURE_CONFIG, useClass: PatchedGestureConfig}
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingViewerComponent);
    component = fixture.componentInstance;
    canvas = fixture.debugElement.query(By.css('canvas'));
  });

  it('should look a certain way', fakeAsync(() => {
    let json = require('./api-mock.json');
    apiService.getDrawing.and.returnValue(Promise.resolve(json));
    fixture.detectChanges();

    expect(component.drawing.animator.time).toBe(0);

    tick(2000);
    expect(component.drawing.animator.time).toBe(0.6300000000000004);
    expect(canvas.nativeElement.toDataURL()).toBe(require('./t1.json').image);

    tick(2000);
    expect(component.drawing.animator.time).toBe(0.2550000000000008);
    expect(canvas.nativeElement.toDataURL()).toBe(require('./t2.json').image);

    /*
     When the canvas changes for whatever reason and the expected values need to be updated, console log the toDataURL() and copy the value into
     the expected json files after verifying they are correct in the browser.
     */
  }));

});