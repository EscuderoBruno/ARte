import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Estado {
  nombre: string;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class EstadosService {
  constructor(private http: HttpClient) {}

  getAllEstados(): Observable<Estado[]> {
    return this.http.get<any[]>(environment.apiURL + '/estados');
  }
}
