import { Injectable } from '@angular/core';;


@Injectable({
  providedIn: 'root'
})

export class DateService {

  constructor() { }

  transformarFecha(fecha: Date, idioma: 'es' | 'va' | 'en' | 'html'){

    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // De 0 a 11
    const anio = fecha.getFullYear();

    const diaFormateado = dia < 10 ? '0' + dia : dia;
    const mesFormateado = mes < 10 ? '0' + mes : mes;

    switch (idioma) {
      case 'es':
      case 'va':
        return `${diaFormateado}-${mesFormateado}-${anio}`;
      case 'en':
        return `${mesFormateado}-${diaFormateado}-${anio}`;
      case 'html':
        return `${anio}-${mesFormateado}-${diaFormateado}`;
      default:
        return `${diaFormateado}-${mesFormateado}-${anio}`;
    }
  }

}
