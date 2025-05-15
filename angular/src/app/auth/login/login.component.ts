import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialLoginModule,
  SocialUser,
} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private cookies: CookieService,
    private authService: SocialAuthService
  ) {}

  nombre = new FormControl('');
  contrasenya = new FormControl('');

  user?: SocialUser;
  loggedIn?: boolean;

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
      console.log(user);
      try {
        this.http
          .post(environment.apiURL + '/auth/googlelogin', user)
          .subscribe((response: any) => {
            console.log(response);
            this.cookies.set('withuUserToken', response.token);
            this.router.navigate(['/administrador']);
          });
      } catch (error) {
        // Mensaje usuario no permitido
        console.log('Usuario no permitido');
      }
    });
  }

  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  decodeJWTToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  handleOauthResponse(response: any) {
    const responsePayload = this.decodeJWTToken(response.credential);
    console.log(responsePayload);
    this.cookies.set('withuUserToken', JSON.stringify(responsePayload));
    this.router.navigate(['/administrador']);
  }

  login(event: any) {
    event.preventDefault();
    try {
      this.http
        .post(environment.apiURL + '/auth/login', {
          nombre: this.nombre.value,
          contrasenya: this.contrasenya.value,
        })
        .subscribe((response: any) => {
          console.log(response);
          this.cookies.set('withuUserToken', response.token);
          location.href = '/administrador';
          //this.router.navigate(['/administrador']);
        });
    } catch (error) {
      console.log('Usuario y contraseña incorrectos.');
    }
  }
}
