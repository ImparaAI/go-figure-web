import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnimatorComponent } from '@app/animator/animator.component';

const routes: Routes = [
  {path: '', component: AnimatorComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
