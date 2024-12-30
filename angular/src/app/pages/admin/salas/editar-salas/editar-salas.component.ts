import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BreadcrumbService } from '../../../../commons/admin/breadcrumb/breadcrumb.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';

import { SalaService } from '../sala-servicio.service';
import { Sala } from '../sala-servicio.service';
import { PieceService } from '../../piezas/pieza-servicio.service';
import { Pieza } from '../../piezas/pieza-servicio.service';
import { ExposicionService } from '../../exposiciones/exposicion-service.service';
import { Exposicion } from '../../exposiciones/exposicion-service.service';
import { Estado, EstadosService } from '../../../../services/estados.service';

@Component({
  selector: 'app-editar-salas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-salas.component.html',
  styleUrl: './editar-salas.component.css'
})

export class EditarSalasComponent implements OnInit {

  nuevaSala!: FormGroup;
  exposiciones: Exposicion[] = [];

  formularioEnviado = false;

  estadosPosibles: Estado[] = [];
  pieces: Pieza[] = [];
  idToEdit: string | null = null;
  sala: Sala | null = null;
  exposicion: Exposicion | null = null;
  exposicionNombre: string | null = null;

  constructor(private route: ActivatedRoute, 
              private salaService: SalaService, 
              private pieceService: PieceService, 
              private exposicionService: ExposicionService,
              private estadosService: EstadosService,
              private router: Router, 
              private breadcrumbService: BreadcrumbService, 
              private location: Location,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const idParam = this.route.snapshot.paramMap.get('id');
      
      if (idParam !== null) {
        this.idToEdit = idParam;
        // Obtener la pieza
        this.salaService.getOne(this.idToEdit).subscribe(data => {
          this.sala = data;
          this.sala.estado_id = data.estado_id;
          // Actualizar el título de la página dinámicamente
          this.breadcrumbService.updateBreadcrumb('Editar salas', ['Inicio', 'Salas', this.sala.nombre, 'Editar']);
          // Inicializar nuevaSala con los datos de la sala obtenida
          this.initForm(); // Llamar a una función para inicializar nuevaSala aquí
        });
      }
    });
    // Obtener todas las piezas
    this.pieceService.getAll().subscribe(data => {
      this.pieces = data;
    });
    // Obtener todas las exposiciones
    this.exposicionService.getAll().subscribe(data => {
      this.exposiciones = data;
    });
    // Obtener todas los estados
    this.estadosService.getAllEstados().subscribe(data => {
      this.estadosPosibles = data;
    });
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
  }

  get nombre_control() {
    return this.nuevaSala.controls['nombre'];
  }

  get estado_control() {
    return this.nuevaSala.controls['estado_id'];
  }

  get exposicion_control(){
    return this.nuevaSala.controls['exposicion'];
  }

  noZeroValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value === '0') {
        return { 'noZero': { value: value } };
      }
      return null;
    };
  }

  // Función para inicializar nuevaSala con los datos de la sala
  private initForm() {
    this.nuevaSala = new FormGroup({
      nombre: new FormControl<string>(this.sala?.nombre ?? '', [Validators.required]),
      descripcion: new FormControl<string>(this.sala?.descripcion ?? ''),
      exposicion: new FormControl<string>(this.sala?.exposicion_id ?? '', this.noZeroValidator()),
      estado_id: new FormControl<string>(this.sala?.estado_id ?? '', this.noZeroValidator()),
    });
  }

  navigateToPiece(salaId: number) {
    this.router.navigate(['/sala', salaId]);
  }

  editarSala(event: any) {
    event.preventDefault();
    this.formularioEnviado = true;
    if(!this.nuevaSala.valid){ return; }
    
    // Verificar si idToEdit tiene un valor definido
    if (this.idToEdit !== undefined && this.idToEdit !== null) {

      const exposicionValue: string = this.nuevaSala.value.exposicion ?? 1;
      console.log(exposicionValue);
  
      this.salaService.editOne(this.idToEdit, {
        nombre: this.nuevaSala.value.nombre || '',
        descripcion: this.nuevaSala.value.descripcion || '',
        exposicion_id: exposicionValue || '',
        estado_id: this.nuevaSala.value.estado_id || ''
      }).subscribe((data: Sala) => {
        console.log(data);
        this.router.navigate(['/administrador/salas']);
      });
    } else {
      console.error('Error: idToEdit no está definido o es nulo.');
    }
  }

  volver() {
    this.location.back();
  }
}
