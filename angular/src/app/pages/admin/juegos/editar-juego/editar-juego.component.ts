import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { BreadcrumbService } from '../../../../commons/admin/breadcrumb/breadcrumb.service';
import { Juego, JuegoService } from '../juego-servicio.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  Exposicion,
  ExposicionService,
} from '../../exposiciones/exposicion-service.service';
import { Estado, EstadosService } from '../../../../services/estados.service';
import { PiezasSelectorComponent } from '../../../../components/piezas-selector/piezas-selector.component';
import { PiezaLista } from '../../piezas/pieza-servicio.service';
import { RouterLink } from '@angular/router';
import { DateService } from '../../../../services/date.service';
import { Pregunta } from '../../../../services/pregunta.service';

@Component({
  selector: 'app-editar-juegos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    PiezasSelectorComponent,
  ],
  templateUrl: './editar-juego.component.html',
  styleUrl: './editar-juego.component.css',
})
export class EditarJuegoComponent {
  @ViewChild(PiezasSelectorComponent) piezaSelector!: PiezasSelectorComponent;

  formularioEnviado = false;
  exposiciones: Exposicion[] = [];
  estados: Estado[] = [];
  piezaSeleccionada: PiezaLista | null = null;

  editarJuego = new FormGroup({
    nombre: new FormControl('', Validators.required),
    descripcion: new FormControl(''),
    fecha: new FormControl(''),
    exposicion: new FormControl('0', this.noZeroValidator()),
    estado: new FormControl('0', this.noZeroValidator()),
  });

  id: string = '';

  piezas: PiezaLista[] = [];

  constructor(
    private juegoService: JuegoService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private exposicionService: ExposicionService,
    private estadoService: EstadosService,
    private route: ActivatedRoute,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    console.log(this.id);

    this.juegoService.getOne(this.id).subscribe((data) => {
      console.log(data);
      this.editarJuego.setValue({
        nombre: data.nombre || '',
        descripcion: data.descripcion || '',
        fecha: this.dateService.transformarFecha(
          new Date(data.fecha || '') || new Date(),
          'html'
        ),
        exposicion: data.exposicion_id || '0',
        estado: data.estado_id || '0',
      });
      console.log(data.Pregunta);
      data.Pregunta.forEach((pregunta: Pregunta) => {
        console.log(pregunta.pieza.informacion);
        const index = pregunta.pieza.informacion.findIndex((_info) => {
          console.log(_info.idioma.id);
          return _info.idioma.id === 'es';
        });
        console.log('aa');
        if (index === -1) return;
        this.piezas.push({
          id: pregunta.pieza.id,
          estado_id: pregunta.pieza.estado_id,
          exposicion_id: pregunta.pieza.sala?.exposicion_id || '',
          exposicion_nombre: pregunta.pieza.sala?.exposicion?.nombre || '',
          imagen: pregunta.pieza.imagen || '',
          nombre: pregunta.pieza.informacion[index].nombre || '',
          sala_id: pregunta.pieza.sala?.id || '',
          sala_nombre: pregunta.pieza.sala?.nombre || '',
          texto_completo:
            pregunta.pieza.informacion[index].texto_completo || '',
          texto_facil: pregunta.pieza.informacion[index].texto_facil || '',
        });
      });
    });
    this.exposicionService.getAll().subscribe((data) => {
      this.exposiciones = data;
    });
    this.estadoService.getAllEstados().subscribe((data) => {
      this.estados = data;
    });

    // Actualizar el título de la página dinámicamente
    this.breadcrumbService.updateBreadcrumb('Editar juego', [
      'Home',
      'Juego',
      'Editar',
    ]);
  }

  get nombre() {
    return this.editarJuego.controls['nombre'];
  }
  get exposicion() {
    return this.editarJuego.controls['exposicion'];
  }
  get estado() {
    return this.editarJuego.controls['estado'];
  }

  handlerSubmit(evt: Event) {
    evt.preventDefault();
    this.formularioEnviado = true;
    if (!this.editarJuego.valid) {
      return;
    }
    const juegoNuevo: Omit<Juego, 'id'> = {
      nombre: this.editarJuego.value.nombre || '',
      estado_id: this.editarJuego.value.estado || '',
      exposicion_id: this.editarJuego.value.exposicion || '',
      fecha: new Date(this.editarJuego.value.fecha || ''),
      Pregunta: [],
      piezas: this.piezas,
    };
    if (this.editarJuego.value.descripcion) {
      juegoNuevo.descripcion = this.editarJuego.value.descripcion;
    }
    console.log(juegoNuevo);
    this.juegoService.editOne(this.id, juegoNuevo).subscribe((data) => {
      console.log(data);
    });
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

  getPiezaSeleccionada(evt: PiezaLista | null) {
    this.piezaSeleccionada = evt;
  }

  addPieza() {
    if (this.piezaSeleccionada) {
      this.piezas.push(this.piezaSeleccionada);
      this.piezaSeleccionada = null;
      document.getElementById('closeModal')?.click();
    }
  }

  removePieza(id: string) {
    const index = this.piezas.findIndex((_pieza) => _pieza.id === id);
    this.piezas.splice(index, 1);
  }

  volver() {
    this.router.navigate(['/administrador/juegos']);
  }
}
