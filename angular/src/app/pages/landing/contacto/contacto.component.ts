import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class AppContactoComponent {

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookies: CookieService
  ) { }

  contacto(event: any) {
    event.preventDefault();
  }

}
