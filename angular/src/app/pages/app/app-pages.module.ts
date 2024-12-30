import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { NgToggleModule } from 'ng-toggle-button';

import { NavbarComponent } from '../../commons/app/navbar/navbar.component';
import { SidebarComponent } from '../../commons/app/sidebar/sidebar.component';
import { AppLayoutComponent } from '../../layouts/app-layout/app-layout.component';
import { EngineComponent } from './adulto/engine/3js/engine.component';
import { AppNiñosComponent } from './niño/niños/niños.component';
import { PiezasComponent } from './adulto/piezas/piezas.component';
import { NgToggleComponent } from 'ng-toggle-button';

import { ReactiveFormsModule } from '@angular/forms';

import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';

@NgModule({
  declarations: [
    AppLayoutComponent,
    NavbarComponent,
    SidebarComponent,
    EngineComponent,
    AppNiñosComponent,
    PiezasComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    NgToggleModule,
    NgxScannerQrcodeModule
  ]
})
export class AppPagesModule { }
