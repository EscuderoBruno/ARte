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
  selector: 'app-sala',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sala.component.html',
  styleUrl: './sala.component.css'
})
export class SalaComponent implements OnInit {

  pieces: PiezaLista[] = [];
  piecesAPI: PiezaLista[] = [];
  sala: Sala | null = null;
  exposicion: Exposicion | null = null;
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
  listadoTitulo: string = "";

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
      this.listadoTitulo = "Listado de piezas";
    } else if (idioma == "en") {
      this.listadoTitulo = "List of pieces";
    } else if (idioma == "va") {
      this.listadoTitulo = "Llista de peces";
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

    this.salaService.getOne(this.id).subscribe((data) => {
      this.sala = data;
      if (data.exposicion_id) {
        this.expoService.getOne(data.exposicion_id).subscribe((data) => {
          this.exposicion = data;
        })
      }
    });

  }

  goToPiece(piezaId: string) {
    let idioma: string = this.route.snapshot.params['idioma'];
    this.router.navigate(['../pieza', piezaId, idioma]);
  }

  goToExposicion(exposicionId: string) {
    let idioma: string = this.route.snapshot.params['idioma'];
    const ruta = ['../pieza/exposicion', exposicionId, idioma];
    console.log('Ruta:', ruta);
    this.router.navigate(ruta);
  }  

}
