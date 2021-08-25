import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import {ManagerComponent} from "./components/manager/manager.component";
import {AppComponent} from "./app.component";

const routes: Route[] = [
  {
    path: '',
    component: ManagerComponent,
  },
  {
    path: 'manager/:tab',
    component: ManagerComponent,
  },
  {
    path: 'queries',
    component: ManagerComponent,
  },
  // {
  //   path: 'account/login',
  //   component: LoginComponent,
  // },
  // {
  //   path: 'account/registration',
  //   component: RegistrationComponent,
  // },
  // {
  //   path: 'messages/:id',
  //   component: MessageComponent,
  // },
  // {
  //   path: 'friends',
  //   component: FriendsComponent,
  // },
  // {
  //   path: 'dialogs',
  //   component: DialogComponent,
  // },
  // {
  //   path: 'harold',
  //   component: HaroldComponent,
  // },
  // {
  //   path: 'logout',
  //   component: LogoutComponent,
  // },
  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
