import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Pieza } from '../pages/admin/piezas/pieza-servicio.service';
import { Idioma } from './idioma.service';

export interface Informacion {
  id: string;
  pieza: Pieza;
  idioma: Idioma;
  nombre?: string;
  texto_completo?: string;
  texto_facil?: string;
  audio?: string;
}

@Injectable({
  providedIn: 'root',
})
export class InformacionService {
  constructor(private http: HttpClient, private cookies: CookieService) {}

  apiUrl = environment.apiURL + '/info';

  headers = new HttpHeaders({
    Authorization: 'Bearer ' + this.cookies.get('withuUserToken'),
  });

  options = { headers: this.headers };

  getOne(id: string): Observable<Informacion> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.options);
  }

  getAll(): Observable<Informacion[]> {
    return this.http.get<any[]>(this.apiUrl, this.options);
  }

  createNew(element: FormData): Observable<Informacion> {
    return this.http.post<any>(this.apiUrl, element, this.options);
  }

  editOne(id: string, element: FormData): Observable<Informacion> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, element, this.options);
  }

  deleteOne(id: string): Observable<Informacion> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.options);
  }
}
