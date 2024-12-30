import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from '../../../../commons/admin/breadcrumb/breadcrumb.service';
import { Exposicion, ExposicionService } from '../exposicion-service.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Sala } from '../../salas/sala-servicio.service';
import { SalaService } from '../../salas/sala-servicio.service';

@Component({
  selector: 'app-ver-exposicion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ver-exposicion.component.html',
  styleUrl: './ver-exposicion.component.css'
})

export class VerExposicionComponent {
  
  constructor(
    private breadcrumbService: BreadcrumbService,
    private exposicionService: ExposicionService,
    private salaService: SalaService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  salas: Sala[] = [];
  totalExposiciones: number = 0; // Total de exposiciones
  cantidadPorPagina: number = 5; // Cantidad de entradas por página
  numPagina: number = 1; // Página actual
  exposicionSeleccionada: string = '';
  totalSalas: number = 0;
  nombreFiltro: string = "";
  maxSalas: number = 0;

  exposicion: Exposicion = {
    id: '',
    nombre: '',
    descripcion: '',
    estado_id: '',
    fecha_inicio: new Date(),
    fecha_fin: undefined,
    imagen: '../../../../../assets/images/piezas/defualt_image.png',
  };

  ngOnInit(): void {

    let id: string = this.route.snapshot.params['id'];
    this.exposicionService.getOne(id).subscribe((data: Exposicion) => {
      this.exposicion = data;
      this.exposicionSeleccionada = data.nombre;
      if (this.exposicion.imagen == null) {
        this.exposicion.imagen = '../../../../../assets/images/exposiciones/alcudia2.jpg';
      }
      // Actualizar el título de la página dinámicamente
      this.breadcrumbService.updateBreadcrumb('Ver exposición', ['Inicio', 'Exposiciones', this.exposicionSeleccionada]);
      console.log("Expo: " + this.exposicion.nombre);
    })
    // Obtener salas
    this.exposicionService.getSalasExposicion(id).subscribe(data => {
      this.totalSalas = data.length;
      this.maxSalas = data.length;
    });
    this.obtenerSalas((this.cantidadPorPagina)*(this.numPagina-1)+1, (this.cantidadPorPagina)*(this.numPagina));
  }

  // Método para navegar a la ruta que incluye /editar
  navigateToEditar() {
    this.router.navigate(['/administrador/exposiciones/editar', this.exposicion.id]);
  }

  volver() {
    this.location.back();
  }

  obtenerSalas(desde: number, hasta: number) {
    let id: string = this.route.snapshot.params['id'];
    this.exposicionService.getOne(id).subscribe((data: Exposicion) => {
      this.exposicion = data;
      this.exposicionSeleccionada = data.nombre;
      if (this.exposicion.imagen == null) {
        this.exposicion.imagen = '../../../../../assets/images/exposiciones/alcudia2.jpg';
      }

      console.log(this.nombreFiltro + this.exposicionSeleccionada);

      this.salaService.getNumSalas(1, 1000, this.nombreFiltro, this.exposicion.id)
        .subscribe(data => {
          // Aquí puedes manejar los datos de las salas recibidas
          this.totalSalas = data.length;
          console.log(data.length);
        });

        this.salaService.getNumSalas(desde, hasta, this.nombreFiltro, this.exposicion.id)
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
      });
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

  navigateToSala(salaId: string) {
    this.router.navigate(['administrador/salas/ver/', salaId]);
  }
}
