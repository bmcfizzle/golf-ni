import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScorecardComponent } from './scorecard/scorecard.component';



const routes: Routes = [
  {path: 'scorecard', component: ScorecardComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
