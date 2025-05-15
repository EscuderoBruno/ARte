import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PieceService, Pieza } from '../pieza-servicio.service';
import { AlertService } from '../../../../services/alert.service';
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
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

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
  newTextura = '../../../../assets/images/piezas/defualt_image.png';
  newModelo = '../../../../assets/images/piezas/defualt_image.png';
  idiomas: Idioma[] = [];
  salas: Sala[] = [];
  estadosPosibles: Estado[] = [];

  datos_generales = new FormGroup({
    sala: new FormControl('0', this.noZeroValidator()),
    estado: new FormControl('0', this.noZeroValidator()),
  });

  datos_idiomas: Array<FormGroup> = [];
  newAudios = Array<String | null>();
  imagen = new FormControl('');

  formularioEnviado = false;
  nombreModelo: string = 'Modelo';

  constructor(
    private pieceService: PieceService,
    private informacionService: InformacionService,
    private salaService: SalaService,
    private alertService: AlertService,
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
      data.forEach((_idioma) => {
        this.datos_idiomas.push(
          new FormGroup({
            nombre: new FormControl(''),
            texto_completo: new FormControl(''),
            texto_facil: new FormControl(''),
            idioma: new FormControl(_idioma.id),
          })
        );
        this.newAudios.push(null);
      });
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
    const fileInputImage = document.getElementById(
      'fileInputImage'
    ) as HTMLInputElement;
    if (fileInputImage) {
      fileInputImage.value = '';
    }
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
    const fileInputPicto = document.getElementById(
      'fileInputPicto'
    ) as HTMLInputElement;
    if (fileInputPicto) {
      fileInputPicto.value = '';
    }
  }

  cambiarTextura(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newTextura = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  borrarTextura() {
    this.newTextura = '../../../../assets/images/piezas/defualt_image.png';
    const fileInputTextura = document.getElementById(
      'fileInputTextura'
    ) as HTMLInputElement;
    if (fileInputTextura) {
      fileInputTextura.value = '';
    }
  }

  cambiarModelo(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.renderizarModelo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  borrarModelo() {
    this.newModelo = '../../../../assets/images/piezas/defualt_image.png';
    const fileInputModel = document.getElementById(
      'fileInputModel'
    ) as HTMLInputElement;
    if (fileInputModel) {
      fileInputModel.value = '';
    }
  }

  volver() {
    this.location.back();
  }

  handleSubmit(event: any) {
    event.preventDefault();

    new FormData(event.target).forEach((el) => console.log(el));

    this.formularioEnviado = true;
    if (!this.datos_generales.valid) {
      return;
    }
    const formData = new FormData(event.target);

    if (this.datos_generales.value.sala) {
      formData.append('sala_id', this.datos_generales.value.sala);
    }
    if (this.datos_generales.value.estado) {
      formData.append('estado_id', this.datos_generales.value.estado);
    }

    // Convertir FormData a un objeto regular
    const formObject: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    // Imprimir el objeto
    console.log(formObject);

    this.pieceService.createNew(formData).subscribe((piezaCreada) => {
      console.log('Pieza creada con éxito: ', piezaCreada);

      // Crear la información de idioma independientemente de si hay datos en nuevaInfoIdioma
      this.datos_idiomas.forEach((form, index) => {
        const nuevaInfoIdioma = new FormData();
        nuevaInfoIdioma.append('idioma_id', form.controls['idioma'].value);
        nuevaInfoIdioma.append('pieza_id', piezaCreada.id);
        if (form.controls['nombre'].value !== '') {
          nuevaInfoIdioma.append('nombre', form.controls['nombre'].value);
        }
        if (form.controls['texto_completo'].value !== '') {
          nuevaInfoIdioma.append(
            'texto_completo',
            form.controls['texto_completo'].value
          );
        }
        if (form.controls['texto_facil'].value !== '') {
          nuevaInfoIdioma.append(
            'texto_facil',
            form.controls['texto_facil'].value
          );
        }
        const inputFile = document.getElementById('audioFile-' + index) as any;
        if (inputFile && inputFile.files.length === 1) {
          nuevaInfoIdioma.append('audio', inputFile.files[0]);
        }
        // Crear la información de idioma incluso si nuevaInfoIdioma está vacía
        this.informacionService.createNew(nuevaInfoIdioma).subscribe((info) => {
          console.log('Información de idioma creada:', info);
        });
      });

      // Navegar a la página de piezas después de crear la información de idioma
      this.router.navigate(['/administrador/piezas']);
      this.alertService.showAlertPiezas(true);
    });
  }

  addAudio(evt: any) {
    const file = evt.target.files[0];
    const id = Number(evt.target.id.split('-')[1]);
    const audioURL = URL.createObjectURL(file);
    this.newAudios[id] = audioURL;
  }

  deleteAudio(i: number) {
    this.newAudios[i] = null;
    const input = document.getElementById(`audioFile-${i}`) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  renderizarModelo(modeloURL: string) {
    // Crear un nuevo cargador de Three.js para archivos OBJ
    const loader = new OBJLoader();
  
    // Cargar el archivo OBJ
    loader.load(
      modeloURL,
      (object) => {
        // Asegurarnos de que el objeto cargado sea del tipo Object3D
        const loadedObject = object as THREE.Object3D;
  
        // Crear una escena
        const scene = new THREE.Scene();

        // Establecer el color de fondo de la escena en blanco
        scene.background = new THREE.Color(0x888888); // Color blanco

        // Agregar el objeto cargado a la escena
        scene.add(loadedObject);

        // Agregar luces para iluminar la escena
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
  
        // Crear una cámara y un renderer con una relación de aspecto más alta
        const aspectRatio = window.innerWidth / window.innerHeight;
        const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
  
        // Configurar la posición y el zoom de la cámara
        camera.position.set(0, 0, 5);
        camera.zoom = 2.5;
        camera.updateProjectionMatrix();
  
        // Renderizar la escena
        renderer.render(scene, camera);
  
        // Capturar la imagen y asignarla como vista previa del modelo
        const imageURL = renderer.domElement.toDataURL();
        this.newModelo = imageURL;
        this.nombreModelo = modeloURL;
      },
      undefined,
      (error) => {
        console.error('Error al cargar el modelo:', error);
      }
    );
  }  
}
