import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importa map de rxjs/operators

@Injectable({
  providedIn: 'root'
})

export class IncidcadoresService {

  constructor(private http: HttpClient) { }

  getAllIndicators(): Observable<any[]> {
    return this.http.get<any[]>('api/indicators');
  }

  // Otros métodos para agregar, actualizar y eliminar indicadores

  getIndicatorsChartData(): Observable<{ labels: string[], values: number[] }> {
    // Lógica para obtener datos de indicadores y formatearlos para la gráfica
    return this.getAllIndicators().pipe(
      map(indicators => {
        const labels = indicators.map(indicator => indicator.name);
        const values = indicators.map(indicator => indicator.value);
        return { labels, values };
      })
    );
  }
}
