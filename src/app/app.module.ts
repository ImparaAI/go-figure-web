import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AnimatorComponent } from './animator/animator.component';
import { CapturerComponent } from './capturer/capturer.component';

@NgModule({
  declarations: [
    AppComponent,
    AnimatorComponent,
    CapturerComponent,
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
