import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import {ManagerComponent} from './components/manager/manager.component';

const routes: Route[] = [
  {
    path: '',
    component: ManagerComponent,
  },
  {
    path: 'manager/:tab',
    component: ManagerComponent,
  },
  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
