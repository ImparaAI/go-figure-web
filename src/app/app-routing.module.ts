import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapturerComponent } from '@app/capturer/capturer.component';
import { AnimatorComponent } from '@app/animator/animator.component';

const routes: Routes = [
  {path: '', component: CapturerComponent, pathMatch: 'full'},
  {path: 'drawing/:id', component: AnimatorComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
