// alert.service.ts
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AlertService {

    visibleSala: boolean = false;
    visibleExposicion: boolean = false;
    visiblePieza: boolean = false;


    showAlertSalas(b: boolean) {
        this.visibleSala = b;
    }

    getAlertSalas(): boolean {
        return this.visibleSala;
    }

    showAlertExposiciones(b: boolean) {
        this.visibleExposicion = b;
    }

    getAlertExposiciones(): boolean {
        return this.visibleExposicion;
    }

    showAlertPiezas(b: boolean) {
        this.visiblePieza = b;
    }

    getAlertPiezas(): boolean {
        return this.visiblePieza;
    }
    
}
