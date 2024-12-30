import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { SalasComponent } from './salas/listado-salas/salas.component';
import { PiezasComponent } from './piezas/listado-piezas/piezas.component';
import { EditarSalasComponent } from './salas/editar-salas/editar-salas.component';
import { CrearSalaComponent } from './salas/crear-sala/crear-sala.component';
import { CrearPiezaComponent } from './piezas/crear-pieza/crear-pieza.component';
import { ListadoExposicionesComponent } from './exposiciones/listado-exposiciones/listado-exposiciones.component';
import { CrearExposicionComponent } from './exposiciones/crear-exposicion/crear-exposicion.component';
import { PiezasSalaComponent } from './salas/ver-sala/piezas-sala.component';
import { VerExposicionComponent } from './exposiciones/ver-exposicion/ver-exposicion.component';
import { EditarExposicionComponent } from './exposiciones/editar-exposicion/editar-exposicion.component';
import { EditarPiezaComponent } from './piezas/pieza-editar/pieza-editar.component';
import { PerfilComponent } from '../perfil/perfil.component';
import { CrearJuegoComponent } from './juegos/crear-juego/crear-juego.component';
import { JuegoDetalleComponent } from './juegos/ver-juego/juego-detalle.component';
import { ListadoJuegoComponent } from './juegos/listado-juego/listado-juego.component';
import { IndicadoresComponent } from './indicadores/indicadores.component';
import { EditarJuegoComponent } from './juegos/editar-juego/editar-juego.component';

const routes: Routes = [

  { path: 'administrador', component: AdminLayoutComponent,
    children: [
      { path: '', component: DashboardComponent},
      { path: 'perfil', component: PerfilComponent},
      { path: 'indicadores', component: IndicadoresComponent},
      { path: 'usuarios', component: UsuariosComponent},
      { path: 'salas', component: SalasComponent},    
      { path: 'salas/editar/:id', component: EditarSalasComponent},
      { path: 'salas/crear', component: CrearSalaComponent},
      { path: 'salas/ver/:id', component: PiezasSalaComponent},
      { path: 'piezas', component: PiezasComponent},
      { path: 'piezas/editar/:id', component: EditarPiezaComponent},
      { path: 'piezas/crear', component: CrearPiezaComponent},
      { path: 'exposiciones', component: ListadoExposicionesComponent},
      { path: 'exposiciones/ver/:id', component: VerExposicionComponent},    
      { path: 'exposiciones/crear', component: CrearExposicionComponent},
      { path: 'exposiciones/editar/:id', component: EditarExposicionComponent},
      // { path: '**', redirectTo: ''}
      { path: 'juegos', component: ListadoJuegoComponent},
      { path: 'juego/:id', component: JuegoDetalleComponent},
      { path: 'juegos/crear', component: CrearJuegoComponent},
      { path: 'juegos/editar/:id', component: EditarJuegoComponent},
      { path: 'exposicion/:id/editar', component: EditarExposicionComponent},
  ]},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class AdminPagesRoutingModule { }
