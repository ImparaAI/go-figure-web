import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InspirationComponent } from './inspiration/inspiration.component';
import { DrawingCreatorComponent } from './drawing/creator/drawing-creator.component';
import { DrawingAnimatorComponent } from '@app/drawing/animator/drawing-animator.component';

const routes: Routes = [
  {path: '', component: DrawingCreatorComponent, pathMatch: 'full'},
  {path: 'drawing/:id', component: DrawingAnimatorComponent},
  {path: 'inspiration', component: InspirationComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }