import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';

import { AuthModule } from './auth/auth.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './commons/admin/footer/footer.component';
import { AdminPagesModule } from './pages/admin/admin-pages.module';
import { AppPagesModule } from './pages/app/app-pages.module';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CookieService } from "ngx-cookie-service";
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

LOAD_WASM().subscribe();

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    AppPagesModule,
    AdminPagesModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    NgxScannerQrcodeModule,
  ],
  providers: [CookieService, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
