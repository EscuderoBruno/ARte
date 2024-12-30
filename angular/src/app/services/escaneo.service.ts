import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Pieza } from '../pages/admin/piezas/pieza-servicio.service';
import { IncidcadoresService } from '../indicadores/indicadores.service';

export interface escaneoPieza {
  id: string,
  fecha?: Date;
  tiempo?: Number;
  motor_grafico?: Number;
  audio?: Number;
  pieza_id?: string;
  pieza?: Pieza;
}

export interface DataEscaneoPieza {
  values: number[];
  names: string[];
  title: string;
}

export interface escaneoJuego {
  nombre: string;
  color: string;
}

@Injectable({
  providedIn: 'root',
})

export class escaneoService {

  constructor(
    private http: HttpClient,
    private cookies: CookieService,
  ) {}

  apiUrlPieza = environment.apiURL + '/indicadores/escaneoPieza';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + this.cookies.get('withuUserToken')
  });

  options = { headers: this.headers };

  getAllEscaneosPieza(pieza_id: string): Observable<escaneoPieza[]> {
    return this.http.get<any[]>(this.apiUrlPieza, { 
      params: { pieza_id: pieza_id },
      headers: this.headers // Agregar this.options como parte de los headers
    });
  }

  getFiltroEscaneosPieza(year: string): Observable<DataEscaneoPieza>;
  getFiltroEscaneosPieza(year: string, month: string): Observable<DataEscaneoPieza>;
  getFiltroEscaneosPieza(year: string, month: string, week: string): Observable<DataEscaneoPieza>;
  getFiltroEscaneosPieza(year: string, month: string, week: string, day: string): Observable<DataEscaneoPieza>;
  
  getFiltroEscaneosPieza(year: string, month?: string, week?: string, day?: string): Observable<DataEscaneoPieza> {
    let params = new HttpParams().set('year', year.toString());

    if (month !== undefined) {
      params = params.set('month', month.toString());
    }

    if (week !== undefined) {
      params = params.set('week', week.toString());
    }

    if (day !== undefined) {
      params = params.set('day', day.toString());
    }

    console.log('URL:', `${this.apiUrlPieza}/filtro?${params.toString()}`);

    return this.http.get<DataEscaneoPieza>(`${this.apiUrlPieza}/filtro`, { 
      params: params,
      headers: this.headers
    });
  }

  createNewEscaneosPieza(element: Omit<escaneoPieza, 'id'>): Observable<escaneoPieza> {
    return this.http.post<any>(this.apiUrlPieza, element, this.options);
  }

  editarEscaneosPieza(id: string, element: Omit<escaneoPieza, 'id'>): Observable<escaneoPieza> {
    return this.http.put<any>(`${this.apiUrlPieza}/${id}`, element, this.options);
  }
}
