import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';
import { SidebarComponent } from '../../commons/admin/sidebar/sidebar.component';
import { NavbarComponent } from '../../commons/admin/navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { BreadcrumbComponent } from '../../commons/admin/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../commons/admin/footer/footer.component';
import { PieChartComponent } from '../../indicadores/pie-chart/pie-chart.component';
import { PieChartComponent2 } from '../../indicadores/pie-chart2/pie-chart2.component';
import { BarChartComponent } from '../../indicadores/bar-chart/bar-chart.component';
import { IndicadoresComponent } from './indicadores/indicadores.component';
import { LineChartComponent } from '../../indicadores/line-chart/line-chart.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    SidebarComponent,
    NavbarComponent,
    DashboardComponent,
    IndicadoresComponent,
    UsuariosComponent,
    BreadcrumbComponent,
    FooterComponent,
    PieChartComponent,
    PieChartComponent2,
    BarChartComponent,
    LineChartComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    QRCodeModule
  ]
})
export class AdminPagesModule { }
