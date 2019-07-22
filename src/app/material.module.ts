import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatSliderModule } from '@angular/material';

let modules = [
  MatCardModule,
  MatSliderModule,
  MatButtonModule,
  MatCheckboxModule,
]

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule { }