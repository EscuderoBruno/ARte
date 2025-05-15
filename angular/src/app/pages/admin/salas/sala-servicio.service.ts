import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Exposicion } from '../exposiciones/exposicion-service.service';

export interface Sala {
  id: string,
  nombre: string,
  descripcion?: string,
  estado_id?: string,
  exposicion_id?: string,
  exposicion_nombre?: string,
  exposicion?: Exposicion,
  totalEscaneos?: number;
}

@Injectable({
  providedIn: 'root'
})

export class SalaService {

  constructor(
    private http: HttpClient,
    private cookies: CookieService,
  ) { }


  apiUrl = environment.apiURL + '/sala';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + this.cookies.get('withuUserToken')
  });

  options = { headers: this.headers };

  getOne(id: string): Observable<Sala> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.options);
  }

  getAll(): Observable<Sala[]> {
    return this.http.get<any[]>(this.apiUrl, this.options);
  }

  getExposicionSala(id: string): Observable<Exposicion> {
    return this.http.get<any>(`${this.apiUrl}/${id}/exposicion`, this.options);
  }

  getNumSalas(desde: number, hasta: number, nombre: string, exposicion_id: string) {
    return this.http.get<any[]>(this.apiUrl, { 
      params: { desde: desde, hasta: hasta, nombre: nombre, exposicion_id: exposicion_id },
      headers: this.headers // Agregar this.options como parte de los headers
    });
  }
  

  createNew(element: Omit<Sala, 'id'>): Observable<Sala> {
    return this.http.post<any>(this.apiUrl, element, this.options);
  }

  deleteOne(id: string): Observable<Sala> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.options);
  }

  editOne(id: string, element: Omit<Sala, 'id'>): Observable<Sala> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, element, this.options);
  }


}