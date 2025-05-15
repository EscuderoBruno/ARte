import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppLayoutComponent } from '../../layouts/app-layout/app-layout.component';
import { AppNiñosComponent } from './niño/niños.component';
import { EngineComponent } from './adulto/engine/3js/engine.component';
import { AppLandingComponent } from '../landing/landing.component';
import { SelfEngineComponent } from './adulto/engine/self-engine/self-engine.component';
import { PiezasComponent } from './adulto/piezas/piezas.component';
import { AppPortadaNiñosComponent } from './niño/portada_niños.component';
import { AppFinalNiñosComponent } from './niño/final_niños';
import { SalaComponent } from './adulto/sala/sala.component';
import { PoliticaPrivacidadComponent } from '../landing/politica-privacidad/politica-privacidad.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';
import { ExposicionComponent } from './adulto/exposicion/exposicion.component';
import { ExposicionesComponent } from './adulto/exposiciones/exposiciones.component';

const routes: Routes = [
  {
    path: 'alcudio',
    component: AppLayoutComponent,
    children: [
      { path: 'resultados/:id', component: AppFinalNiñosComponent },
      { path: ':id', component: AppPortadaNiñosComponent },
      { path: 'juego/:id', component: AppNiñosComponent },
      // Puedes agregar más rutas secundarias aquí si es necesario
    ],
  },
  {
    path: 'pieza',
    component: AppLayoutComponent,
    children: [
      { path: 'exposiciones/:idioma', component: ExposicionesComponent },
      { path: 'self_engine/:id', component: SelfEngineComponent },
      { path: '3js', component: EngineComponent },
      { path: 'sala/:id/:idioma', component: SalaComponent },
      { path: 'exposicion/:id/:idioma', component: ExposicionComponent },
      { path: ':id/:idioma', component: PiezasComponent },
      // Puedes agregar más rutas secundarias aquí si es necesario
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppPagesRoutingModule {}
