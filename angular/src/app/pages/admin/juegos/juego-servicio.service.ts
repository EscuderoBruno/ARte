// juego-servicio.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';
import { PiezaLista } from '../piezas/pieza-servicio.service';
import { Exposicion } from '../exposiciones/exposicion-service.service';
import { Estado } from '../../../services/estados.service';
import { FormGroup } from '@angular/forms';
import { Pregunta } from '../../../services/pregunta.service';


export interface Juego {
  id: string,
  nombre: string,
  descripcion?: string,
  fecha?: Date,
  exposicion_id: string,
  estado_id: string,
  Pregunta: Pregunta[],
  piezas: PiezaLista[],
}

export interface JuegoLista {
  id: string,
  nombre: string,
  descripcion?: string,
  fecha: Date,
  exposicion: Exposicion,
  estado: Estado,
  totalEscaneos?: number;
}

export interface Pagination {
  pagina: number,
  desde: number,
  hasta: number,
  total: number,
  totalPag: number,
}

export interface JuegoListaAPI {
  pagination: Pagination,
  juegos: JuegoLista[]
}

@Injectable({
  providedIn: 'root'
})
export class JuegoService {
  
  constructor(
    private http: HttpClient,
    private cookies: CookieService,
  ) { }

  apiUrl = environment.apiURL + '/juego';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + this.cookies.get('withuUserToken')
  });

  params = new HttpParams();

  options = { headers: this.headers, params: this.params };

  getOne(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.options);
  }

  getAll(filtros?: any): Observable<JuegoListaAPI> {

    if(filtros.nombre.value && filtros.nombre.value !== ''){
      this.options.params.set('nombre', filtros.nombre.value)
    }
    if(filtros.exposicion.value){
      this.options.params.set('exposicion', filtros.exposicion.value)
    }
    if(filtros.pagina.value){
      this.options.params.set('pag', filtros.pagina.value)
    }
    if(filtros.numero.value){
      this.options.params.set('lim', filtros.numero.value);
    }
    return this.http.get<any>(this.apiUrl, this.options);
  }

  createNew(element: Omit<Juego, 'id'>): Observable<Juego> {
    return this.http.post<any>(this.apiUrl, element, this.options);
  }

  deleteOne(id: string): Observable<Juego> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.options);
  }

  editOne(id: string, element: Omit<Juego, 'id'>): Observable<Juego> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, element, this.options);
  }
}
