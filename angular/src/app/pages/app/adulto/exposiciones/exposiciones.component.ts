import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from '../../../../commons/admin/breadcrumb/breadcrumb.service'

import { DateService } from '../../../../services/date.service';
import { Pagination, PieceService, Pieza, PiezaLista } from '../../../admin/piezas/pieza-servicio.service';
import { Sala, SalaService } from '../../../admin/salas/sala-servicio.service';
import { Exposicion, ExposicionService } from '../../../admin/exposiciones/exposicion-service.service';
import { Idioma, IdiomaService } from '../../../../services/idioma.service';
import { environment } from '../../../../../environments/environment';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exposicion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './exposiciones.component.html',
  styleUrl: './exposiciones.component.css'
})
export class ExposicionesComponent implements OnInit {

  pieces: PiezaLista[] = [];
  piecesAPI: PiezaLista[] = [];
  salas: Sala[] | null = null;
  exposiciones: Exposicion[] | null = null;
  exposicionesActivas: Exposicion[] | null = null;
  exposicionesPasadas: Exposicion[] | null = null;
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
  id: string | null = null;
  ocultarDescripcion: boolean = false;
  pestanaSeleccionada: Number = 1;
  titulo: string = "";
  activas: string = "";
  pasadas: string = "";

  baseAPI = environment.apiURL;

  constructor(
    private route: ActivatedRoute,
    private pieceService: PieceService,
    private salaService: SalaService,
    private expoService: ExposicionService,
    private dateService: DateService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private idiomaService: IdiomaService
  ) {}

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id') || '';
    let idioma: string = this.route.snapshot.params['idioma'];

    if (idioma == 'es') {
      this.ocultarDescripcion = true;
      this.titulo = "EXPOSICIONES";
      this.activas = "Activas";
      this.pasadas = "Pasadas";
    } else if (idioma == "en") {
      this.titulo = "EXHIBITIONS";
      this.activas = "Active";
      this.pasadas = "Previous";
    } else if (idioma == "va") {
      this.titulo = "EXPOSICIONS";
      this.activas = "Actives";
      this.pasadas = "Passades";
    }

    this.idiomaService.getAll().subscribe((idiomasDisponibles) => {
      this.idiomas = idiomasDisponibles;
      this.filtros.idioma.setValue(idioma);
      this.filtros.sala.setValue(this.id);

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

    this.expoService.getAll().subscribe((data) => {
      // Obtener la fecha actual
      const fechaActual = new Date();
      this.exposiciones = data;
  
      // Filtrar las exposiciones activas y pasadas
      this.exposicionesActivas = this.exposiciones.filter(exposicion => {
          const fechaFin = exposicion.fecha_fin;
          if (fechaFin) {
              return new Date(fechaFin) > fechaActual;
          }
          return true;
      });
  
      this.exposicionesPasadas = this.exposiciones.filter(exposicion => {
          const fechaFin = exposicion.fecha_fin;
          if (fechaFin) {
              return new Date(fechaFin) <= fechaActual;
          }
          return false;
      });
     });  

  }

  goToExposicion(exposicionId: string) {
    let idioma: string = this.route.snapshot.params['idioma'];
    this.router.navigate(['../pieza/exposicion', exposicionId, idioma]);
  }

}
