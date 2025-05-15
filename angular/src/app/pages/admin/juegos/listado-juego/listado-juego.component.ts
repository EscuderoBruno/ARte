import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BreadcrumbService } from '../../../../commons/admin/breadcrumb/breadcrumb.service'

import { DateService } from '../../../../services/date.service';
import { Sala, SalaService } from '../../salas/sala-servicio.service';
import { InformacionService } from '../../../../services/informacion.service';
import { FormControl, ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { Idioma, IdiomaService } from '../../../../services/idioma.service';
import { environment } from '../../../../../environments/environment';
import { JuegoLista, JuegoService } from '../juego-servicio.service';
import { Exposicion, ExposicionService } from '../../exposiciones/exposicion-service.service';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-listado-juego',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, QRCodeModule],
  templateUrl: './listado-juego.component.html',
  styleUrl: './listado-juego.component.css'
})

export class ListadoJuegoComponent implements OnInit {

  juegos: JuegoLista[] = [];

  exposiciones: Exposicion[] = [];

  paginacion = {
    pagina: 1,
    desde: 1,
    hasta: 10,
    total: 0,
    totalPag: 1,
  };

  filtros = {
    nombre: new FormControl(''),
    exposicion: new FormControl('0'),
    numero: new FormControl(10),
    pagina: 1,
  }
  idToDelete: string = '';

  baseAPI = environment.apiURL;

  constructor(
    private juegoService: JuegoService,
    private exposicionService: ExposicionService,
    private dateService: DateService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    
    this.getJuegos()
    
    this.exposicionService.getAll().subscribe(data => {
      this.exposiciones = data;
    })

    // Actualizar el título de la página dinámicamente
    this.breadcrumbService.updateBreadcrumb('Juegos', ['Inicio', 'Juegos']);
  }

  goToEditPie(piezaId: string) {
    this.router.navigate(['/administrador/juegos/editar', piezaId]);
  }

  goToCreatePie() {
    this.router.navigate(['/administrador/juegos/crear']);
  }

  deletePie() {
    this.juegoService.deleteOne(this.idToDelete).subscribe(data => {
      console.log(data);
      let indexToDelete = this.juegos.findIndex(exp => exp.id === this.idToDelete);
      this.juegos.splice(indexToDelete, 1);
    });
  }

  getJuegos(){
    this.juegoService.getAll(this.filtros).subscribe(data => {
      this.juegos = data.juegos;
      console.log(this.juegos)
    })
  }

  goToPag(pag: number){
    this.filtros.pagina = pag;
    this.getJuegos();
  }

  irAlEnlace() {
    const url = '/alcudio/' + this.idToDelete;
    window.open(url, '_blank');
  }

  goToViewJuego(juegoId: string) {
    const url = '/alcudio/' + juegoId;
    window.open(url, '_blank');
  }

  convertBase64ToBlob(Base64Image: string) {
    // split into two parts
    const parts = Base64Image.split(";base64,")
    // hold the content type
    const imageType = parts[0].split(":")[1]
    // decode base64 string
    const decodedData = window.atob(parts[1])
    // create unit8array of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length)
    // insert all character code into uint8array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i)
    }
    // return blob image after conversion
    return new Blob([uInt8Array], { type: imageType })
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
      link.download = 'qr-juego-' + this.idToDelete;
      link.click();
    }
  }

}