import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { BreadcrumbService } from '../../../../commons/admin/breadcrumb/breadcrumb.service';
import { Juego, JuegoService } from '../juego-servicio.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Exposicion, ExposicionService } from '../../exposiciones/exposicion-service.service';
import { Estado, EstadosService } from '../../../../services/estados.service';
import { PiezasSelectorComponent } from '../../../../components/piezas-selector/piezas-selector.component';
import { PiezaLista } from '../../piezas/pieza-servicio.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-crear-juego',
  standalone: true,
  imports: [ReactiveFormsModule, PiezasSelectorComponent, RouterLink],
  templateUrl: './crear-juego.component.html',
  styleUrl: './crear-juego.component.css'
})
export class CrearJuegoComponent {

  formularioEnviado = false;
  exposiciones: Exposicion[] = [];
  estados: Estado[] = [];
  piezaSeleccionada: PiezaLista | null = null;

  crearJuego = new FormGroup({
    nombre: new FormControl('', Validators.required),
    descripcion: new FormControl(''),
    fecha: new FormControl(''),
    exposicion: new FormControl('0', this.noZeroValidator()),
    estado: new FormControl('0', this.noZeroValidator())
  })

  piezas: PiezaLista[] = [];

  constructor(
    private juegoService: JuegoService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private exposicionService: ExposicionService,
    private estadoService: EstadosService,
  ) {}

  ngOnInit(): void {
    // Obtener todas las piezas
    
    this.exposicionService.getAll().subscribe(data => {
      this.exposiciones = data;
    })
    this.estadoService.getAllEstados().subscribe(data => {
      this.estados = data;
    })

    // Actualizar el título de la página dinámicamente
    this.breadcrumbService.updateBreadcrumb('Crear juego', ['Home', 'Juego', 'Crear']);
  }

  get nombre(){
    return this.crearJuego.controls['nombre']
  }
  get exposicion(){
    return this.crearJuego.controls['exposicion']
  }
  get estado(){
    return this.crearJuego.controls['estado']
  }

  handlerSubmit(evt: Event){
    evt.preventDefault();
    this.formularioEnviado = true;
    if(!this.crearJuego.valid){ return; }
    const juegoNuevo: Omit<Juego, 'id'> = {
      nombre: this.crearJuego.value.nombre || '',
      estado_id: this.crearJuego.value.estado || '',
      exposicion_id: this.crearJuego.value.exposicion || '',
      fecha: new Date(this.crearJuego.value.fecha || ''),
      piezas: this.piezas,
      Pregunta: [] 
    }
    if(this.crearJuego.value.descripcion){
      juegoNuevo.descripcion = this.crearJuego.value.descripcion
    }
    console.log(juegoNuevo)
    this.juegoService.createNew(juegoNuevo).subscribe(data => {
      console.log(data);
    })
    this.router.navigate(['/administrador/juegos']);
  }

  noZeroValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value === '0') {
        return { noZero: { value: value } };
      }
      return null;
    };
  }

  navigateToJuego(juegoId: number) {
    this.router.navigate(['/juego', juegoId]);
  }

  getPiezaSeleccionada(evt: PiezaLista | null){
    this.piezaSeleccionada = evt;
  }

  addPieza(){
    if(this.piezaSeleccionada){
      this.piezas.push(this.piezaSeleccionada)
      this.piezaSeleccionada = null;
      document.getElementById('closeModal')?.click();
    }
  }

  removePieza(id: string){
    const index = this.piezas.findIndex(_pieza => _pieza.id === id);
    this.piezas.splice(index, 1);
  }

  volver(){
    this.router.navigate(['/administrador/juegos']);
  }
  
}
