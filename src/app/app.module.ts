import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ManagerComponent } from './components/manager/manager.component';
import { TabsComponent } from './components/tabs/tabs.component';
import {AppRoutingModule} from "./app-routing.module";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ManagerAsideComponent } from './components/manager-aside/manager-aside.component';
import { ManagerFormComponent } from './components/manager-form/manager-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ManagerComponent,
    TabsComponent,
    ManagerAsideComponent,
    ManagerFormComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
