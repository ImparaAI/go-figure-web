import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { DrawingRecentComponent } from './drawing/recent/drawing-recent.component';
import { DrawingCreatorComponent } from './drawing/creator/drawing-creator.component';
import { DrawableCanvasComponent } from './canvas/drawable/drawable-canvas.component';
import { DraggableCanvasComponent } from './canvas/draggable/draggable-canvas.component';
import { DrawingAnimatorComponent } from '@app/drawing/animator/drawing-animator.component';

@NgModule({
  declarations: [
    AppComponent,
    DrawingRecentComponent,
    DrawingCreatorComponent,
    DrawableCanvasComponent,
    DraggableCanvasComponent,
    DrawingAnimatorComponent,
  ],
  imports: [
    //browser modules come first
    BrowserModule,
    BrowserAnimationsModule,

    FormsModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }