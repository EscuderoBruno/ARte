import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BreadcrumbService } from '../../../../commons/admin/breadcrumb/breadcrumb.service';

import {
  Pagination,
  PieceService,
  Pieza,
  PiezaLista,
} from '../pieza-servicio.service';
import { DateService } from '../../../../services/date.service';
import { Sala, SalaService } from '../../salas/sala-servicio.service';
import { InformacionService } from '../../../../services/informacion.service';
import { AlertService } from '../../../../services/alert.service';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Idioma, IdiomaService } from '../../../../services/idioma.service';
import { environment } from '../../../../../environments/environment';
import { FixMeLater, QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-piezas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, QRCodeModule],
  templateUrl: './piezas.component.html',
  styleUrl: './piezas.component.css',
})
export class PiezasComponent implements OnInit {
  pieces: PiezaLista[] = [];
  piecesAPI: PiezaLista[] = [];
  salas: Sala[] = [];
  idiomas: Idioma[] = [];
  paginacion: Pagination = {
    pagina: 1,
    desde: 1,
    hasta: 10,
    total: 0,
    totalPag: 1,
  };
  filtros = {
    nombre: new FormControl(''),
    sala: new FormControl('0'),
    numero: new FormControl(10),
    pagina: 1,
    idioma: new FormControl(''),
  };
  idToDelete: string = '';

  baseAPI = environment.apiURL;
  showAlert = false;
  showAlert2 = false;

  constructor(
    private pieceService: PieceService,
    private salaService: SalaService,
    private dateService: DateService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private idiomaService: IdiomaService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.idiomaService.getAll().subscribe((idiomasDisponibles) => {
      this.idiomas = idiomasDisponibles;
      this.filtros.idioma.setValue(idiomasDisponibles[1].id);

      // Obtener todas las piezas
      this.pieceService
        .getLista(this.filtros.idioma.value || 'es', this.filtros)
        .subscribe((data) => {
          this.pieces = data.piezas;
          this.piecesAPI = data.piezas;
          this.paginacion = data.pagination;
          console.log(data);
        });
    });

    this.salaService.getAll().subscribe((data) => {
      this.salas = data;
    });

    this.showAlert = this.alertService.getAlertPiezas();

    setTimeout(() => {
      this.alertService.showAlertPiezas(false);
      this.showAlert = this.alertService.getAlertPiezas();
    }, 3000);

    // Actualizar el título de la página dinámicamente
    this.breadcrumbService.updateBreadcrumb('Piezas', ['Inicio', 'Piezas']);
  }

  goToViewPie(piezaId: string) {
    const url = this.router
      .createUrlTree(['../pieza', piezaId, this.filtros.idioma.value])
      .toString();
    window.open(url, '_blank');
  }

  goToEditPie(piezaId: string) {
    this.router.navigate(['/administrador/piezas/editar', piezaId]);
  }

  goToCreatePie() {
    this.router.navigate(['/administrador/piezas/crear']);
  }

  deletePie() {
    this.pieceService.deleteOne(this.idToDelete).subscribe((data) => {
      console.log(data);
      let indexToDelete = this.pieces.findIndex(
        (exp) => exp.id === this.idToDelete
      );
      this.pieces.splice(indexToDelete, 1);
      // Mensaje borrado
      this.alertService.showAlertPiezas(true);
      this.showAlert2 = this.alertService.getAlertPiezas();
      setTimeout(() => {
        console.log("Borrado");
        this.alertService.showAlertPiezas(false);
        this.showAlert2 = this.alertService.getAlertPiezas();
      }, 3000);
    });
  }

  formatearFecha(date: string): string {
    const fecha = new Date(date);
    return this.dateService.transformarFecha(fecha, 'es');
  }

  filtrarPiezas() {
    this.pieceService
      .getLista(this.filtros.idioma.value || 'es', this.filtros)
      .subscribe((data) => {
        this.pieces = data.piezas;
        this.piecesAPI = data.piezas;
        this.paginacion = data.pagination;
      });
  }

  goToPag(pag: number) {
    if (pag > this.paginacion.totalPag) return;
    this.filtros.pagina = pag;
    this.filtrarPiezas();
  }

  irAlEnlace() {
    const url = this.router
      .createUrlTree(['../pieza', this.idToDelete, this.filtros.idioma.value])
      .toString();
    window.open(url, '_blank');
  }

  generarCodigoQR(url: string) {
    //let nombre = document.getElementById("nombre").value;
    // console.log("QUÉ PASA POR PARÁMETRO????" + url);
    // if(url){
    //     let contenedorQr = document.getElementById("codigoQr");
    //     contenedorQr.innerHTML = "";
    //     new QRCode(contenedorQr, url);
    //     document.getElementById("contenedorQr").style.display = "block";
    // }else {
    //     alert("Por favor, ingresa una URL válida");
    // }
  }

  convertBase64ToBlob(Base64Image: string) {
    // split into two parts
    const parts = Base64Image.split(';base64,');
    // hold the content type
    const imageType = parts[0].split(':')[1];
    // decode base64 string
    const decodedData = window.atob(parts[1]);
    // create unit8array of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);
    // insert all character code into uint8array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // return blob image after conversion
    return new Blob([uInt8Array], { type: imageType });
  }

  descargarQr() {
    let canvas = null;

    canvas = document.querySelector('canvas')?.toDataURL('image/png');

    if (canvas) {
      // converts base 64 encoded image to blobData
      let blobData = this.convertBase64ToBlob(canvas);
      // saves as image
      const blob = new Blob([blobData], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // name of the file
      link.download = 'qr-pieza-' + this.idToDelete;
      link.click();
    }
  }

  closeAlert(): void {
    this.showAlert = false;
  }
}
