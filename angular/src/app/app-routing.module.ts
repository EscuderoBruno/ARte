import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthRoutingModule } from './auth/auth.routing';
import { AdminPagesRoutingModule } from './pages/admin/admin-pages.routing';
import { AppPagesRoutingModule } from './pages/app/app-pages.routing';
import { AppLandingComponent } from './pages/landing/landing.component';
import { IndicadoresRoutingModule } from './indicadores/indicadores.routing';
import { AppContactoComponent } from './pages/landing/contacto/contacto.component';
import { AppConocerComponent } from './pages/landing/conocer_mas/conocer.component';
import { PoliticaPrivacidadComponent } from './pages/landing/politica-privacidad/politica-privacidad.component';


const routes: Routes = [

  //  /login y /recovery  --> authroutingmodule
  //  /dashboard/*        --> pagesroutingmodule

  // Ruta para Landing
  { path: '', component: AppLandingComponent },
    
  // Ruta para Contacto
  { path: 'contacto', component: AppContactoComponent },
  // Ruta para conocenos
  { path: 'conocenos', component: AppConocerComponent },
  // Ruta para Contacto
  { path: 'politica-de-privacidad', component: PoliticaPrivacidadComponent },

  // Ruta predeterminada (catch-all)
  { path: '**', redirectTo: 'landing' },
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
