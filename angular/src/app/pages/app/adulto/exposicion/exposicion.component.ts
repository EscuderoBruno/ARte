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
  templateUrl: './exposicion.component.html',
  styleUrl: './exposicion.component.css'
})
export class ExposicionComponent implements OnInit {

  pieces: PiezaLista[] = [];
  piecesAPI: PiezaLista[] = [];
  salas: Sala[] | null = null;
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
  titulo: string = "";
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
      this.titulo = "EXPOSICIONES";
      this.listadoTitulo = "Listado de salas";
    } else if (idioma == "en") {
      this.titulo = "EXHIBITIONS";
      this.listadoTitulo = "List of rooms";
    } else if (idioma == "va") {
      this.titulo = "EXPOSICIONS";
      this.listadoTitulo = "Llista de sals";
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
      this.salas = data.filter(sala => sala.exposicion_id === this.id);
    });

    this.expoService.getOne(this.id).subscribe((data) => {
      this.exposicion = data;
    })

  }

  goToSala(salaId: string) {
    let idioma: string = this.route.snapshot.params['idioma'];
    this.router.navigate(['../pieza/sala', salaId, idioma]);
  }

  goToExposiciones() {
    let idioma: string = this.route.snapshot.params['idioma'];
    const ruta = ['pieza/exposiciones', idioma];
    console.log('Ruta:', ruta);
    this.router.navigate(ruta);
  }  

}
