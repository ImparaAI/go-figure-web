import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Point2D, Point3D } from '@app/structures/point';
import { ComponentFixture, TestBed, async, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';

import { DrawingBoardComponent } from './drawing-board.component';

describe('DrawingBoardComponentInit', () => {
  let component: DrawingBoardComponent,
      fixture: ComponentFixture<DrawingBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [
        DrawingBoardComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingBoardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  let expectError = () => {
    expect(() => {fixture.detectChanges()}).toThrow(new Error("A valid width and height need to be provided to the drawing board."));
  }

  it('should complain about missing both width and height', () => {
    expectError();
  });

  it('should complain about missing height', () => {
    component.width = 700;
    expectError();
  });

  it('should complain about missing width', () => {
    component.height = 400;
    expectError();
  });

  it('should work with proper inputs', () => {
    component.width = 700;
    component.height = 400;
    fixture.detectChanges();
  });

});

describe('DrawingBoardComponent', () => {
  let component: DrawingBoardComponent,
      fixture: ComponentFixture<DrawingBoardComponent>,
      canvas: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [
        DrawingBoardComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingBoardComponent);
    component = fixture.componentInstance;

    component.width = 700;
    component.height = 400;
    fixture.detectChanges();

    canvas = fixture.debugElement.query(By.css('canvas'));
  });

  it('should draw something with a mouse', () => {
    let points: Point2D[] = [
          new Point2D(50, 50),
          new Point2D(51, 51),
          new Point2D(52, 52),
          new Point2D(53, 53),
        ],
        outputPoints: Point3D[];

    component.drawingUpdated.subscribe((value) => outputPoints = value);

    points.forEach((point: Point2D, i: number) => {
      let eventName: string = i === 0 ? 'mousedown' : 'mousemove';

      canvas.triggerEventHandler(eventName, {layerX: point.x, layerY: point.y});
    });

    canvas.triggerEventHandler('mouseup', null);

    fixture.whenStable().then(() => {
      expect(outputPoints.length).toBe(5);

      outputPoints.forEach((outputPoint: Point3D, i: number) => {
        let originalIndex: number = (i === outputPoints.length - 1) ? 0 : i,
            xOffset: number = 11.94,
            yOffset: number = 5.94;

        expect(outputPoint.x).toBe(points[originalIndex].x + xOffset);
        expect(outputPoint.y).toBe(points[originalIndex].y + yOffset);

        if (!i)
          expect(outputPoint.time).toBe(0);
        else
          expect(outputPoint.time >= outputPoints[i - 1].time).toBe(true);
      });
    });
  });

});