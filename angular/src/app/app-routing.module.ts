import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthRoutingModule } from './auth/auth.routing';
import { AdminPagesRoutingModule } from './pages/admin/admin-pages.routing';
import { AppPagesRoutingModule } from './pages/app/app-pages.routing';
import { AppLandingComponent } from './pages/landing/landing.component';
import { IndicadoresRoutingModule } from './indicadores/indicadores.routing';


const routes: Routes = [

  //  /login y /recovery  --> authroutingmodule
  //  /dashboard/*        --> pagesroutingmodule

  { path: '**', redirectTo: ''},
  { path: '', component: AppLandingComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    AdminPagesRoutingModule,
    AppPagesRoutingModule,
    IndicadoresRoutingModule
  ],
  exports: [RouterModule],
})

export class AppRoutingModule { }
