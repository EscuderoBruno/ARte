import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Informacion } from '../../../services/informacion.service';
import { Sala } from '../salas/sala-servicio.service';

export interface Pieza {
  id: string;
  estado_id: string;
  pictograma?: string;
  modelo?: string;
  textura?:string;
  imagen?: string;
  sala_id: string;
  informacion: Informacion[];
  sala?: Sala;
}

export interface PiezaListaAPI {
  pagination: Pagination;
  piezas: PiezaLista[];
}

export interface Pagination {
  pagina: number;
  desde: number;
  hasta: number;
  total: number;
  totalPag: number;
}

export interface PiezaLista {
  imagen: string | null;
  id: string;
  nombre: string;
  texto_completo: string;
  texto_facil: string;
  sala_id: string;
  sala_nombre: string;
  exposicion_id: string;
  exposicion_nombre: string;
  estado_id: string;
  totalEscaneos?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PieceService {
  constructor(private http: HttpClient, private cookies: CookieService) {}

  apiUrl = environment.apiURL + '/piezas';

  headers = new HttpHeaders({
    Authorization: 'Bearer ' + this.cookies.get('withuUserToken'),
  });

  params = new HttpParams();

  options = { headers: this.headers, params: this.params };

  getOne(id: string): Observable<Pieza> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.options);
  }

  getAll(): Observable<Pieza[]> {
    return this.http.get<any[]>(this.apiUrl, this.options);
  }

  getLista(idioma: string, filtrosValues?: any): Observable<PiezaListaAPI> {
    if (filtrosValues) {
      this.options.params = this.options.params
        .set('nombre', filtrosValues?.nombre?.value)
        .set('sala', filtrosValues?.sala?.value)
        .set('pag', filtrosValues?.pagina)
        .set('lim', filtrosValues?.numero?.value)
    }

    return this.http.get<any>(`${this.apiUrl}/lista/${idioma}`, this.options);
  }

  getInfo(id: string, idioma: string): Observable<Informacion> {
    return this.http.get<any>(
      `${this.apiUrl}/info/${id}/${idioma}`,
      this.options
    );
  }

  createNew(formData: FormData): Observable<Pieza> {
    return this.http.post<any>(this.apiUrl, formData, this.options);
  }

  editOne(id: string, element: FormData): Observable<Pieza> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, element, this.options);
  }

  deleteOne(id: string): Observable<Pieza> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.options);
  }
}
