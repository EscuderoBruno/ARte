import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Pieza } from '../pages/admin/piezas/pieza-servicio.service';

export interface Pregunta {
  id: string,
  pieza: Pieza,
  pregunta: string,
  respuesta: string,
}

@Injectable({
  providedIn: 'root'
})

export class PreguntaService {

  constructor(
    private http: HttpClient,
    private cookies: CookieService,
  ) { }

}
