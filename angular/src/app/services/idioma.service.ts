import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

export interface Idioma {
  id: string,
  idioma: string,
  icono: string
}

@Injectable({
  providedIn: 'root'
})

export class IdiomaService {

  constructor(
    private http: HttpClient,
    private cookies: CookieService,
  ) { }


  apiUrl = environment.apiURL + '/idioma';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + this.cookies.get('withuUserToken')
  });

  options = { headers: this.headers };

  getOne(id: string): Observable<Idioma> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.options);
  }

  getAll(): Observable<Idioma[]> {
    return this.http.get<any[]>(this.apiUrl, this.options);
  }

  createNew(element: Omit<Idioma, 'id'>): Observable<Idioma> {
    return this.http.post<any>(this.apiUrl, element, this.options);
  }

  editOne(id: string, element: Omit<Idioma, 'id'>): Observable<Idioma> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, element, this.options);
  }

  deleteOne(id: string): Observable<Idioma> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.options);
  }

}
