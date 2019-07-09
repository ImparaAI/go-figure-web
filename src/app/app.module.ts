import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

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
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
