import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CallbackComponent } from './../app/callback/callback.component';
import {LoginComponent } from './../app/login/login.component'

const routes: Routes = [
  {path:'callback',component:CallbackComponent},
  {path:'login',component:LoginComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
