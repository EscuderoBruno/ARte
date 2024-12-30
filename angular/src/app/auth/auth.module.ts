import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { FooterComponent } from '../commons/app/footer/footer.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    RecoveryComponent,
    FooterComponent
  ],
  exports: [
    AuthLayoutComponent,
    LoginComponent,
    RecoveryComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ]
})
export class AuthModule { }
