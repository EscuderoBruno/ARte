import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface Editor {
  nombre: string,
  correo: string,
  contrasenya: string
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  flagUrl: string = 'flag_1.jpg';
  user: string = 'Error, sin usuario'


  constructor(
    private cookies: CookieService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getUsuario()
  }

  changeLanguage(imageFlag: string){
    this.flagUrl = imageFlag;
  }

  signOut(){
    this.cookies.delete('withuUserToken');
    location.href = '/login';
  }

  getUsuario(){
    let userToken = this.cookies.get('withuUserToken')
    this.http.get<Editor>(environment.apiURL + '/auth/editor', {
      headers: {
        'Authorization': 'Bearer ' + userToken
      }
    }).subscribe((data) => {
      this.user = data.nombre;
    }, (error: HttpErrorResponse) => {
      console.error(error.error.error)
      location.href = '/login';
    })
  }

}
