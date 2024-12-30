import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BreadcrumbService } from '../../../../commons/admin/breadcrumb/breadcrumb.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Idioma, IdiomaService } from '../../../../services/idioma.service';
import { AlertService } from '../../../../services/alert.service';

import { Sala, SalaService } from '../sala-servicio.service';
import { ExposicionService } from '../../exposiciones/exposicion-service.service';
import { Exposicion } from '../../exposiciones/exposicion-service.service';
import { Estado, EstadosService } from '../../../../services/estados.service';

@Component({
  selector: 'app-crear-sala',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-sala.component.html',
  styleUrl: './crear-sala.component.css'
})
export class CrearSalaComponent {

  exposiciones: Exposicion[] = [];
  estadosPosibles: Estado[] = [];

  formularioEnviado = false;

  nuevaSala = new FormGroup({
    nombre: new FormControl<string>('', [Validators.required]),
    descripcion: new FormControl<string>(''),
    exposicion: new FormControl<string>('0', this.noZeroValidator()),
    estado: new FormControl<string>('0', this.noZeroValidator())
  });

  constructor(private salaService: SalaService, 
              private estadoService: EstadosService,
              private router: Router, 
              private breadcrumbService: BreadcrumbService, 
              private location: Location,
              private alertService: AlertService,
              private exposicionService: ExposicionService) {}

  ngOnInit(): void {
    // Obtener todas las exposiciones
    this.exposicionService.getAll().subscribe(data => {
      this.exposiciones = data;
    });
    // Obtener todos los estados
    this.estadoService.getAllEstados().subscribe(data => {
      this.estadosPosibles = data;
    })
    // Actualizar el título de la página dinámicamente
    this.breadcrumbService.updateBreadcrumb('Crear sala', ['Inicio', 'Salas', 'Crear']);
  }

  get nombre() {
    return this.nuevaSala.controls['nombre'];
  }

  get estado() {
    return this.nuevaSala.controls['estado'];
  }

  get exposicion(){
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

  crearSala(event: any){
    event.preventDefault();
    this.formularioEnviado = true;
    if(!this.nuevaSala.valid){ return; }
    this.salaService.createNew({
      nombre: this.nuevaSala.value.nombre || '',
      descripcion: this.nuevaSala.value.descripcion || '',
      exposicion_id: this.nuevaSala.value.exposicion || '',
      estado_id: this.nuevaSala.value.estado || '',
    }).subscribe((data: Sala) => {
      console.log(data);
      this.router.navigate(['/administrador/salas']);
      this.alertService.showAlertSalas(true);
    });
  }

  volver() {
    this.location.back();
  }
}
