import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

describe('AppComponent', () => {
  let component: AppComponent,
      fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

});