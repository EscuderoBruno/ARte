import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppLayoutComponent } from '../../layouts/app-layout/app-layout.component';
import { AppNiñosComponent } from './niño/niños/niños.component';
import { EngineComponent } from './adulto/engine/3js/engine.component';
import { AppLandingComponent } from '../landing/landing.component';
import { SelfEngineComponent } from './adulto/engine/motor_grafico_propio/self-engine/self-engine.component';
import { PiezasComponent } from './adulto/piezas/piezas.component';
import { AppPortadaNiñosComponent } from './niño/niños/portada_niños';

const routes: Routes = [

  { 
    path: 'alcudio',
    component: AppLayoutComponent,
    children: [
      { path: '', component: AppPortadaNiñosComponent },
      { path: 'juego/:id', component: AppNiñosComponent },
      // Puedes agregar más rutas secundarias aquí si es necesario
    ]
  },
  { 
    path: 'pieza',
    component: AppLayoutComponent,
    children: [
      { path: 'self_engine/:id', component: SelfEngineComponent },
      { path: '3js', component: EngineComponent },
      { path: ':id', component: PiezasComponent },
      // Puedes agregar más rutas secundarias aquí si es necesario
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class AppPagesRoutingModule { }
