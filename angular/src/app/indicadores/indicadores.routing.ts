import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PieChartComponent } from './pie-chart/pie-chart.component';
import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';

const routes: Routes = [

  { path: 'indicadores', component: AdminLayoutComponent,
    children: [
      { path: 'barchart', component: PieChartComponent},
      { path: 'linechart', component: BarChartComponent}
  ]},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class IndicadoresRoutingModule { }
