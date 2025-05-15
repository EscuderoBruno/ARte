import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Pieza } from '../pages/admin/piezas/pieza-servicio.service';
import { IncidcadoresService } from '../indicadores/indicadores.service';
import { Juego } from '../pages/admin/juegos/juego-servicio.service';

export interface escaneoPieza {
  id: string,
  fecha?: Date;
  tiempo?: Number;
  motor_grafico?: Number;
  audio?: Number;
  idioma?: string,
  pieza_id?: string;
  pieza?: Pieza;
}

export interface escaneoJuego {
  id: string,
  fecha?: Date;
  tiempo?: Number;
  finalizado?: Number;
  total_piezas?: Number;
  juego_id?: string;
  juego?: Juego;
}

export interface DataEscaneoPieza {
  values: number[];
  names: string[];
  title: string;
}

export interface DataEscaneoJuego {
  values: number[];
  names: string[];
  title: string;
}

export interface Usuario {
  id: string,
  adulto?: Number;
  niño?: Number;
  ultima_sesion?: Date;
}

export interface DataUsuarios {
  values: number[];
  names: string[];
}

export interface UsoIdiomas {
  values: number[];
  names: string[];
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
  apiUrlJuego = environment.apiURL + '/indicadores/escaneoJuego';
  apiUrlUsuario = environment.apiURL + '/usuario';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + this.cookies.get('withuUserToken')
  });

  options = { headers: this.headers };

  // ---------------------------------- Escaneos Pieza ---------------------------------------------- //

  getAllEscaneosPiezas(): Observable<escaneoPieza[]> {
    return this.http.get<any[]>(this.apiUrlPieza, { 
      headers: this.headers // Agregar this.options como parte de los headers
    });
  }

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

  getUsoIdiomas(): Observable<UsoIdiomas> {
    return this.http.get<any>(`${this.apiUrlPieza}/idiomas`, { 
      headers: this.headers // Agregar this.options como parte de los headers
    });
  }

  // ---------------------------------- Escaneos Juego ---------------------------------------------- //

  getAllEscaneosJuegos(): Observable<escaneoJuego[]> {
    return this.http.get<any[]>(this.apiUrlJuego, { 
      headers: this.headers // Agregar this.options como parte de los headers
    });
  }

  getAllEscaneosJuego(juego_id: string): Observable<escaneoJuego[]> {
    return this.http.get<any[]>(this.apiUrlJuego, { 
      params: { juego_id: juego_id },
      headers: this.headers // Agregar this.options como parte de los headers
    });
  }

  getFiltroEscaneosJuego(year: string): Observable<DataEscaneoJuego>;
  getFiltroEscaneosJuego(year: string, month: string): Observable<DataEscaneoJuego>;
  getFiltroEscaneosJuego(year: string, month: string, week: string): Observable<DataEscaneoJuego>;
  getFiltroEscaneosJuego(year: string, month: string, week: string, day: string): Observable<DataEscaneoJuego>;
  
  getFiltroEscaneosJuego(year: string, month?: string, week?: string, day?: string): Observable<DataEscaneoJuego> {
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

    console.log('URL:', `${this.apiUrlJuego}/filtro?${params.toString()}`);

    return this.http.get<DataEscaneoJuego>(`${this.apiUrlJuego}/filtro`, { 
      params: params,
      headers: this.headers
    });
  }

  createNewEscaneosJuego(element: Omit<escaneoJuego, 'id'>): Observable<escaneoJuego> {
    return this.http.post<any>(this.apiUrlJuego, element, this.options);
  }

  editarEscaneosJuego(id: string, element: Omit<escaneoJuego, 'id'>): Observable<escaneoJuego> {
    return this.http.put<any>(`${this.apiUrlJuego}/${id}`, element, this.options);
  }

  // ---------------------------------- Obtener Usuarios ---------------------------------------------- //

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<any[]>(this.apiUrlUsuario, { 
      headers: this.headers // Agregar this.options como parte de los headers
    });
  }

  getIndicadorUsuarios(): Observable<DataUsuarios> {
    return this.http.get<any>(`${this.apiUrlUsuario}/indicadores`, { 
      headers: this.headers // Agregar this.options como parte de los headers
    });
  }

  createNewUsuarioAdulto(): Observable<any> {
    const usuarioData = { adulto: 1, niño: 0 };
    return this.http.post<any>(this.apiUrlUsuario, usuarioData);
  }

  createNewUsuarioNino(): Observable<any> {
    const usuarioData = { niño: 1, adulto: 0 };
    return this.http.post<any>(this.apiUrlUsuario, usuarioData);
  }

  addNino(id: string): Observable<any> {
    const usuarioData = { niño: 1};
    return this.http.put<any>(`${this.apiUrlUsuario}/${id}`, usuarioData, this.options);
  }

  addAdulto(id: string): Observable<any> {
    const usuarioData = { adulto: 1};
    return this.http.put<any>(`${this.apiUrlUsuario}/${id}`, usuarioData, this.options);
  }

}
