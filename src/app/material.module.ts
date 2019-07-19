import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatSliderModule } from '@angular/material';

let modules = [
  MatCardModule,
  MatSliderModule,
  MatButtonModule,
]

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule { }