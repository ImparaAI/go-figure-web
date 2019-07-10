import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
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
    BrowserModule, //should come before most other modules

    MatButtonModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
