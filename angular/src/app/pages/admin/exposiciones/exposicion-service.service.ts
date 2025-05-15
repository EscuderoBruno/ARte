import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Sala } from '../salas/sala-servicio.service';
import { Idioma } from '../../../services/idioma.service';

export interface Exposicion {
  id: string,
  nombre: string,
  autores?: string,
  descripcion?: string,
  estado_id: string,
  fecha_inicio: Date,
  fecha_fin?: Date,
  imagen?: string,
  totalEscaneos?: number;
}

@Injectable({
  providedIn: 'root'
})

export class ExposicionService {

  constructor(
    private http: HttpClient,
    private cookies: CookieService,
  ) { }


  apiUrl = environment.apiURL + '/exposicion';

  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + this.cookies.get('withuUserToken')
  });

  options = { headers: this.headers };

  getOne(id: string): Observable<Exposicion> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.options);
  }

  getSalasExposicion(id: string): Observable<Sala[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/salas`, this.options);
  }

  getAll(): Observable<Exposicion[]> {
    return this.http.get<any[]>(this.apiUrl, this.options);
  }

  getNumExposiciones(desde: number, hasta: number, nombre: string) {
    return this.http.get<any[]>(this.apiUrl, { 
      params: { desde: desde, hasta: hasta, nombre: nombre },
      headers: this.headers // Agregar this.options como parte de los headers
    });
  }  

  createNew(formData: FormData): Observable<Exposicion> {
    console.log(formData.get('imagen'));
    return this.http.post<any>(this.apiUrl, formData, this.options);
  }

  editOne(id: string, element: FormData): Observable<Exposicion> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, element, this.options);
  }

  deleteOne(id: string): Observable<Exposicion> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.options);
  }

}
