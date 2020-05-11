import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScorecardComponent } from './scorecard/scorecard.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: 'scorecard/:id', component: ScorecardComponent},
  {path: 'home', component: HomeComponent},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
