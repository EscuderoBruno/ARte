
import { CSP_NONCE, Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { BreadcrumbService } from '../../../../commons/admin/breadcrumb/breadcrumb.service'

import { ExposicionService } from '../exposicion-service.service';
import { Exposicion } from '../exposicion-service.service';
import { AlertService } from '../../../../services/alert.service';

import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-listado-exposiciones',
  standalone: true,
  imports: [CommonModule,
            FormsModule],
  templateUrl: './listado-exposiciones.component.html',
  styleUrl: './listado-exposiciones.component.css'
})

export class ListadoExposicionesComponent implements OnInit {
  
  exposiciones: Exposicion[] = [];
  idToDelete: string = '';
  showAlert = false;
  showAlert2 = false;

  baseAPI = environment.apiURL;

  nombreFiltro: string = "";
  totalExposiciones: number = 0; // Total de exposiciones

  cantidadPorPagina: number = 4; // Cantidad de entradas por página
  numPagina: number = 1; // Página actual

  constructor(private exposicionService: ExposicionService, 
              private router: Router, 
              private breadcrumbService: BreadcrumbService,
              private alertService: AlertService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Obtener todas las salas
    this.exposicionService.getAll().subscribe(data => {
      this.exposiciones = data;
      this.totalExposiciones = this.exposiciones.length;
    });

    // Actualizar el título de la página dinámicamente
    this.breadcrumbService.updateBreadcrumb('Listado exposiciones', ['Inicio', 'Exposiciones']);

    this.showAlert = this.alertService.getAlertExposiciones();

    setTimeout(() => {
      this.alertService.showAlertExposiciones(false);
      this.showAlert = this.alertService.getAlertExposiciones();
    }, 3000);

    // Obtener exposiciones
    this.obtenerExposiciones((this.cantidadPorPagina)*(this.numPagina-1)+1, (this.cantidadPorPagina)*(this.numPagina));
    console.log(this.exposiciones);
  }

  goToViewExp(exposicionId: string) {
    this.router.navigate(['/administrador/exposiciones/ver', exposicionId]);
  }

  goToEditExp(exposicionId: string) {
    this.router.navigate(['/administrador/exposiciones/editar', exposicionId]);
  }

  goToCreateExp() {
    this.router.navigate(['/administrador/exposiciones/crear']);
  }

  deleteExp() {
    this.exposicionService.deleteOne(this.idToDelete).subscribe(data => {
      console.log(data);
      let indexToDelete = this.exposiciones.findIndex(exp => exp.id === this.idToDelete);
      this.exposiciones.splice(indexToDelete, 1); 
      // Mensaje borrado
      this.alertService.showAlertExposiciones(true);
      this.showAlert2 = this.alertService.getAlertExposiciones();
      setTimeout(() => {
        console.log("Borrado");
        this.alertService.showAlertExposiciones(false);
        this.showAlert2 = this.alertService.getAlertExposiciones();
      }, 3000);
      if ((this.totalExposiciones - 1) % this.cantidadPorPagina === 0) {
        this.guardarPagina(this.numPagina - 1);
      } else {
        this.guardarPagina(this.numPagina);
      }
    });
  }  

  closeAlert(): void {
    this.showAlert = false;
  }

  obtenerExposiciones(desde: number, hasta: number) {

    this.exposicionService.getNumExposiciones(1, 1000, this.nombreFiltro)
      .subscribe(data => {
        // Aquí puedes manejar los datos de las salas recibidas
        this.totalExposiciones = data.length;
        console.log(data.length);
      });

    this.exposicionService.getNumExposiciones(desde, hasta, this.nombreFiltro)
      .subscribe(data => {
        console.log(data);
        // Aquí puedes manejar los datos de las salas recibidas
        this.exposiciones = data;
      });
  }  

  filtroEntradas(event: any) {
    this.cantidadPorPagina = event.target.value;
    this.obtenerExposiciones((this.cantidadPorPagina)*(this.numPagina-1)+1, (this.cantidadPorPagina)*(this.numPagina));
  }

  calcularRango() {
    const primerResultado = Math.min(this.totalExposiciones, (this.numPagina - 1) * this.cantidadPorPagina + 1);
    const ultimoResultado = Math.min(this.numPagina * this.cantidadPorPagina, this.totalExposiciones);
    return { primerResultado, ultimoResultado };
  }

  guardarPagina(pagina: number) {
    this.numPagina = pagina;
    this.obtenerExposiciones((this.cantidadPorPagina)*(this.numPagina-1)+1, (this.cantidadPorPagina)*(this.numPagina));
    console.log("Número de página actual: " + this.numPagina); // Puedes quitar este console.log, es solo para demostración
  }

  calcularPaginas(): number[] {
    const totalPaginas = Math.ceil(this.totalExposiciones / this.cantidadPorPagina);
    return Array.from({length: totalPaginas}, (_, index) => index + 1);
  }

  buscarExposicion(nombre: string) {
    this.nombreFiltro = nombre;
    this.obtenerExposiciones((this.cantidadPorPagina)*(this.numPagina-1)+1, (this.cantidadPorPagina)*(this.numPagina));
  }
}
