import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { BreadcrumbService } from '../../../../commons/admin/breadcrumb/breadcrumb.service'

import { SalaService } from '../sala-servicio.service';
import { Sala } from '../sala-servicio.service';
import { AlertService } from '../../../../services/alert.service';
import { ExposicionService } from '../../exposiciones/exposicion-service.service';
import { Exposicion } from '../../exposiciones/exposicion-service.service';

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salas.component.html',
  styleUrl: './salas.component.css'
})

export class SalasComponent implements OnInit {

  salas: Sala[] = [];
  exposiciones: Exposicion[] = [];
  idToDelete: string = '';
  showAlert = false;
  showAlert2 = false;
  exposicionSeleccionada: string = '';
  exposicion: Exposicion | null = null;
  totalSalas: number = 0;
  maxSalas: number = 0;
  numPagina: number = 1;
  cantidadPorPagina: number = 5;
  nombreFiltro: string = "";

  constructor(private salaService: SalaService, 
              private router: Router, 
              private breadcrumbService: BreadcrumbService,
              private alertService: AlertService,
              private exposicionService: ExposicionService) {}

  ngOnInit(): void {

    // Obtener todas las exposiciones
    this.exposicionService.getAll().subscribe(data => {
      this.exposiciones = data;
      this.totalSalas = this.exposiciones.length;
    });
    // Obtener todas las salas
    this.salaService.getAll().subscribe(data => {
      this.totalSalas = data.length;
      this.maxSalas = data.length;
    });
     
    // Actualizar el título de la página dinámicamente
    this.breadcrumbService.updateBreadcrumb('Listado salas', ['Inicio', 'Salas']);
    // Alerta al crear sala
    this.showAlert = this.alertService.getAlertSalas();
    setTimeout(() => {
      this.alertService.showAlertSalas(false);
      this.showAlert = this.alertService.getAlertSalas();
    }, 3000);

    // Obtener salas
    this.obtenerSalas((this.cantidadPorPagina)*(this.numPagina-1)+1, (this.cantidadPorPagina)*(this.numPagina));
  }

  navigateToSala(salaId: string) {
    this.router.navigate(['administrador/salas/ver/', salaId]);
  }

  navigateToEditSala(salaId: string) {
    this.router.navigate(['administrador/salas/editar/', salaId]);
  }

  navigateToCreateSala() {
    this.router.navigate(['administrador/salas/crear']);
  }

  borrarSala() {
    this.salaService.deleteOne(this.idToDelete).subscribe(data => {
      console.log(data);
      let indexToDelete = this.salas.findIndex(exp => exp.id === this.idToDelete);
      this.salas.splice(indexToDelete, 1);
      // Mensaje borrado
      this.alertService.showAlertSalas(true);
      this.showAlert2 = this.alertService.getAlertSalas();
      setTimeout(() => {
        this.alertService.showAlertSalas(false);
        this.showAlert2 = this.alertService.getAlertSalas();
      }, 3000);
      if ((this.totalSalas-1)%this.cantidadPorPagina == 0) {
        this.guardarPagina(this.numPagina-1);
      } else {
        this.guardarPagina(this.numPagina);
      }
    });
  }

  closeAlert(): void {
    this.showAlert = false;
  }

  seleccionarExposicion(event: any) {

    this.exposicionSeleccionada = event.target.value;
    if (this.exposicionSeleccionada === '') {
      // Obtener todas las salas
      this.numPagina = 1;
      this.obtenerSalas((this.cantidadPorPagina)*(this.numPagina-1)+1, (this.cantidadPorPagina)*(this.numPagina));
      for (let i=0; i<this.salas.length; i++) {
        this.salaService.getExposicionSala(this.salas[i].id).subscribe(
          (exposicion: any) => {
            this.salas[i].exposicion_nombre = exposicion.nombre;
          },
          error => {
            console.error('Error al obtener la exposición:', error);
          }
        );
      }
    } else {
      // Filtrar las salas por el nombre de la exposición seleccionada
      this.obtenerSalas((this.cantidadPorPagina)*(this.numPagina-1)+1, (this.cantidadPorPagina)*(this.numPagina));
    }

    console.log(this.exposicionSeleccionada);
  }

  obtenerSalas(desde: number, hasta: number) {

    this.salaService.getNumSalas(1, 1000, this.nombreFiltro, this.exposicionSeleccionada)
      .subscribe(data => {
        // Aquí puedes manejar los datos de las salas recibidas
        this.totalSalas = data.length;
        console.log(data.length);
      });

    this.salaService.getNumSalas(desde, hasta, this.nombreFiltro, this.exposicionSeleccionada)
      .subscribe(data => {
        console.log(data);
        // Aquí puedes manejar los datos de las salas recibidas
        this.salas = data;
        for (let i=0; i<this.salas.length; i++) {
          this.salaService.getExposicionSala(this.salas[i].id).subscribe(
            (exposicion: any) => {
              this.salas[i].exposicion_nombre = exposicion.nombre;
            },
            error => {
              console.error('Error al obtener la exposición:', error);
            }
          );
        }
      });
  }

  filtroEntradas(event: any) {
    this.cantidadPorPagina = event.target.value;
    this.obtenerSalas((this.cantidadPorPagina)*(this.numPagina-1)+1, (this.cantidadPorPagina)*(this.numPagina));
  }

  calcularRango() {
    const primerResultado = Math.min(this.totalSalas, (this.numPagina - 1) * this.cantidadPorPagina + 1);
    const ultimoResultado = Math.min(this.numPagina * this.cantidadPorPagina, this.totalSalas);
    return { primerResultado, ultimoResultado };
  }

  guardarPagina(pagina: number) {
    this.numPagina = pagina;
    this.obtenerSalas((this.cantidadPorPagina)*(this.numPagina-1)+1, (this.cantidadPorPagina)*(this.numPagina));
    console.log("Número de página actual: " + this.numPagina); // Puedes quitar este console.log, es solo para demostración
  }

  calcularPaginas(): number[] {
    const totalPaginas = Math.ceil(this.totalSalas / this.cantidadPorPagina);
    return Array.from({length: totalPaginas}, (_, index) => index + 1);
  }

  buscarSala(nombre: string) {
    this.nombreFiltro = nombre;
    this.obtenerSalas((this.cantidadPorPagina)*(this.numPagina-1)+1, (this.cantidadPorPagina)*(this.numPagina));
  }
  
}
