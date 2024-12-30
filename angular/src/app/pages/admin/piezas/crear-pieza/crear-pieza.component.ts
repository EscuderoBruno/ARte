import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PieceService, Pieza } from '../pieza-servicio.service';
import { BreadcrumbService } from '../../../../commons/admin/breadcrumb/breadcrumb.service';
import { Location } from '@angular/common';
import { Idioma, IdiomaService } from '../../../../services/idioma.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Sala, SalaService } from '../../salas/sala-servicio.service';
import {
  Informacion,
  InformacionService,
} from '../../../../services/informacion.service';
import { Estado, EstadosService } from '../../../../services/estados.service';

@Component({
  selector: 'app-crear-pieza',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-pieza.component.html',
  styleUrl: './crear-pieza.component.css',
})

export class CrearPiezaComponent {

  newImage = '../../../../assets/images/piezas/defualt_image.png';
  newPictograma = '../../../../assets/images/piezas/defualt_image.png';
  newModelo = '../../../../assets/images/piezas/defualt_image.png';
  idiomas: Idioma[] = [];
  idiomasElegidos: Idioma[] = [];
  idiomasPosibles: Idioma[] = [];
  salas: Sala[] = [];
  estadosPosibles: Estado[] = [];

  datos_generales = new FormGroup({
    sala: new FormControl('0', this.noZeroValidator()),
    estado: new FormControl('0', this.noZeroValidator()),
  });

  datos_idiomas: Array<FormGroup> = [];

  imagen = new FormControl('');

  formularioEnviado = false;

  constructor(
    private pieceService: PieceService,
    private informacionService: InformacionService,
    private salaService: SalaService,
    private idiomaService: IdiomaService,
    private breadcrumbService: BreadcrumbService,
    private location: Location,
    private router: Router,
    private estadoService: EstadosService
  ) {}

  ngOnInit(): void {
    // Actualizar el título de la página dinámicamente
    this.breadcrumbService.updateBreadcrumb('Crear pieza', [
      'Inicio',
      'Piezas',
      'Crear',
    ]);

    this.idiomaService.getAll().subscribe((data) => {
      this.idiomas = data;
      this.idiomasPosibles = this.idiomas;
    });

    this.salaService.getAll().subscribe((data) => {
      this.salas = data;
    });

    this.estadoService.getAllEstados().subscribe((data) => {
      console.log(data);
      this.estadosPosibles = data;
    });
  }

  get sala_control() {
    return this.datos_generales.controls['sala'];
  }

  get estado_control() {
    return this.datos_generales.controls['estado'];
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

  // Cambiar foto modelo
  abrirSelectorDeArchivos() {
    // Hacer clic en el elemento de entrada de archivos
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  cambiarImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  borrarImagen() {
    this.newImage = '../../../../assets/images/piezas/defualt_image.png';
  }

  cambiarPictograma(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newPictograma = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  borrarPictograma() {
    this.newPictograma = '../../../../assets/images/piezas/defualt_image.png';
  }

  cambiarModelo(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newModelo = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  borrarModelo() {
    this.newModelo = '../../../../assets/images/piezas/defualt_image.png';
  }


  volver() {
    this.location.back();
  }


  handleSubmit(event: any) {

    event.preventDefault();

    new FormData(event.target).forEach(el => console.log(el))

    this.formularioEnviado = true;
    if(!this.datos_generales.valid){ return; }
    const formData = new FormData(event.target);

    if(this.datos_generales.value.sala){
      formData.append('sala_id', this.datos_generales.value.sala);
    }
    if(this.datos_generales.value.estado){
      formData.append('estado_id', this.datos_generales.value.estado);
    }

    this.pieceService.createNew(formData).subscribe((piezaCreada) => {
      console.log('Pieza creada con exito: ', piezaCreada);
      this.datos_idiomas.forEach((form, index) => {
        const nuevaInfoIdioma = new FormData();
        nuevaInfoIdioma.append('idioma_id', form.controls['id'].value);
        nuevaInfoIdioma.append('pieza_id', piezaCreada.id);
        if (form.controls['nombre'].value !== '') {
          nuevaInfoIdioma.append('nombre', form.controls['nombre'].value);
        }
        if (form.controls['texto_completo'].value !== '') {
          nuevaInfoIdioma.append('texto_completo', form.controls['texto_completo'].value);
        }
        if (form.controls['texto_facil'].value !== '') {
          nuevaInfoIdioma.append('texto_facil', form.controls['texto_facil'].value);
        }
        const inputFile = document.getElementById('audioFile-' + index) as any;
        if(inputFile && inputFile.files.length === 1){
          nuevaInfoIdioma.append('audio', inputFile.files[0])
        }
        this.informacionService.createNew(nuevaInfoIdioma).subscribe((info) => {
          console.log(info);
        });
      });
      this.router.navigate(['/administrador/piezas']);
    });
  }

  addIdioma(idioma: Idioma, index: number) {
    this.idiomasElegidos.push(idioma);
    this.idiomasPosibles.splice(index, 1);
    this.datos_idiomas.push(
      new FormGroup({
        id: new FormControl(idioma.id),
        nombre: new FormControl(''),
        texto_completo: new FormControl(''),
        texto_facil: new FormControl(''),
        audio: new FormControl(''),
        idioma: new FormControl(''),
      })
    );
  }

  removeIdioma(idioma: Idioma, index: number) {
    console.log(index, idioma);
    this.idiomasPosibles.push(idioma);
    this.idiomasElegidos.splice(index, 1);
    this.datos_idiomas.splice(index, 1);
    const panel = document.getElementById('tabpanel');
    if (!panel) return;
    panel.querySelectorAll('.tab-pane')[index - 1]?.classList.add('active');
    const tab = panel.querySelectorAll('.nav-item .nav-link')[index - 1];
    if (tab) {
      tab.classList.add('active');
      tab.ariaSelected = 'true';
    }
  }
}
