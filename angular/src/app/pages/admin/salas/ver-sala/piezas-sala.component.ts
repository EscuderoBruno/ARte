import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BreadcrumbService } from '../../../../commons/admin/breadcrumb/breadcrumb.service'

import { PieceService } from '../../piezas/pieza-servicio.service';
import { SalaService } from '../sala-servicio.service';
import { Sala } from '../sala-servicio.service';
import { ExposicionService, Exposicion } from '../../exposiciones/exposicion-service.service';

@Component({
  selector: 'app-piezas-sala',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './piezas-sala.component.html',
  styleUrl: './piezas-sala.component.css'
})

export class PiezasSalaComponent {

  pieces: any[] = [];
  salas: any[] = [];
  salaId: string | null = null;
  sala: Sala | null = null;
  exposicion: Exposicion | null = null;
  exposicionNombre: string | null = null;

  constructor(private pieceService: PieceService, 
              private salaService: SalaService, 
              private exposicionService: ExposicionService,
              private router: Router, 
              private route: ActivatedRoute, 
              private breadcrumbService: BreadcrumbService, 
              private location: Location) {}

  ngOnInit(): void {

    let id: string = this.route.snapshot.params['id'];
    // Obtener la sala
    this.salaService.getOne(id).subscribe(data => {
      this.sala = data;
      // Actualizar el título de la página dinámicamente
      this.breadcrumbService.updateBreadcrumb(this.sala.nombre, ['Inicio', 'Salas', this.sala.nombre]);
      // Obtener la exposición de la sala
      if (this.sala && this.sala.exposicion_id) {
        this.exposicionService.getOne(this.sala.exposicion_id).subscribe(
          (data: Exposicion) => {
            this.exposicion = data;
            this.exposicionNombre = data.nombre;
          },
          error => {
            console.error('Error al obtener la exposición:', error);
          }
        );
      } 
    });
    // Obtener todas las piezas
    this.pieceService.getAll().subscribe(data => {
      this.pieces = data;
    });
    // Obtener todas las salas
    this.salaService.getAll().subscribe(data => {
      this.salas = data;
    });
  }

  navigateToPiece(pieceId: number) {
    this.router.navigate(['dashboard/piezas', pieceId]);
  }

  // Método para navegar a la ruta que incluye /editar
  navigateToEditar() {
    let id: string = this.route.snapshot.params['id'];
    this.router.navigate(['administrador/salas/editar/', id]);
  }

  volver() {
    this.location.back();
  }
}
