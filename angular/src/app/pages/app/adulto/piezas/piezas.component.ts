import { Component, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieceService } from '../../../admin/piezas/pieza-servicio.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Pieza, PiezaLista } from '../../../admin/piezas/pieza-servicio.service';
import { SalaService, Sala } from '../../../admin/salas/sala-servicio.service';
import { ExposicionService, Exposicion } from '../../../admin/exposiciones/exposicion-service.service';
import { escaneoPieza, escaneoService, Usuario } from '../../../../services/escaneo.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Idioma, IdiomaService } from '../../../../services/idioma.service';
import { Informacion } from '../../../../services/informacion.service';

import { environment } from '../../../../../environments/environment';
import { coerceArray } from '@angular/cdk/coercion';

import {Html5QrcodeScanner} from "html5-qrcode";

@Component({
  selector: 'app-piezas',
  templateUrl: './piezas.component.html',
  styleUrl: './piezas.component.css'
})

export class PiezasComponent {

  iconoExpandir: boolean = true;
  opcion: number = 0;
  alturaDeseada: number = 40;
  baseAPI = environment.apiURL;
  escaneo: escaneoPieza | null = null;
  tiempo = 0;
  motor_grafico: Number = 0;
  audio: Number = 0;
  timer: any;
  isTimerRunning: boolean = false;
  opcionSeleccionadaIcono: string = 'mdi-format-align-left';
  ocultarBoton: boolean = false;
  modelo: boolean = false;
  borrador: boolean = false;
  publico: boolean = false;

  pictograma: string = "../../../../../assets/images/piezas/pictograma_no_disponible.png";
  pieces: PiezaLista[] = [];
  pieza: Pieza | null = null;
  infoPieza: Informacion | null = null;
  idiomas: Idioma[] = [];
  escaneoPieza: escaneoPieza[] = [];
  salaId: string = '';
  sala: Sala | null = null;
  exposicion: Exposicion | null = null;
  rutaModelo: string = '';
  rutaTextura: string = '';
  rutaAudio: string = '';
  rutaImagen: string = '../../../../../assets/images/piezas/imagen_no_disponible.png';
  verTextoCompleto: string = '';
  verPictogramaCompleto: string = '';
  menu_informacion: string = '';
  menu_audio: string = '';
  menu_pictograma: string = '';

  filtros = {
    nombre: new FormControl(''),
    sala: new FormControl('0'),
    numero: new FormControl(10),
    pagina: 1,
    idioma: new FormControl(''),
  }

  constructor(
    private pieceService: PieceService,
    private salaService: SalaService,
    private expoService: ExposicionService,
    private idiomaService: IdiomaService,
    private escaneoService: escaneoService,
    private route: ActivatedRoute, 
    private router: Router, 
    
  ) {
    // Llamar al método que se ejecutará cada 10 segundos
    this.startTimer();
    // Llamar al método que registra al usuario al cargar la página
    this.registrarUsuario();
  }

  ngOnInit(): void {

    let id: string = this.route.snapshot.params['id'];
    let idioma: string = this.route.snapshot.params['idioma'];

    if (idioma == 'es') {
      this.verTextoCompleto = "Ver texto en pantalla completa";
      this.verPictogramaCompleto = "Ver pictograma en pantalla completa";
      this.menu_informacion= "INORMACIÓN";
      this.menu_audio = 'AUDIO';
      this.menu_pictograma= 'PICTOGRAMA';
    } else if (idioma == "en") {
      this.verTextoCompleto = "View text in full screen";
      this.verPictogramaCompleto = "View pictogram in full screen";
      this.menu_informacion = 'INFORMATION';
      this.menu_audio = 'AUDIO';
      this.menu_pictograma = 'PICTOGRAM';
    } else if (idioma == "va") {
      this.verTextoCompleto = "Veure text en pantalla completa";
      this.verPictogramaCompleto = "Veure pictograma en pantalla completa";
      this.menu_informacion = 'INFORMACIÓ';
      this.menu_audio = 'ÀUDIO';
      this.menu_pictograma = 'PICTOGRAMA';
    }

    this.idiomaService.getAll().subscribe(idiomasDisponibles => {

        this.idiomas = idiomasDisponibles;
        this.filtros.idioma.setValue(idioma);

      // Obtener la pieza
      this.pieceService.getOne(id).subscribe(data => {
        this.pieza = data;
        this.salaId = data.sala_id;
        if (data.estado_id == "Borrador") {
          this.borrador = true;
        } else if( data.estado_id == "Publico") {
          this.publico = true;
        }
        if (data.imagen) {
          this.rutaImagen = this.baseAPI + '/uploads/' + data.imagen; 
        }
        console.log(this.rutaImagen);
        this.salaService.getOne(this.salaId).subscribe((data) => {
          this.sala = data;
          if (data.exposicion_id) {
            this.expoService.getOne(data.exposicion_id).subscribe((data) => {
              this.exposicion = data;
            });
          }
        });
        if (data.pictograma){
          this.pictograma = environment.apiURL + '/uploads/' + data.pictograma;
        }
        if (data.modelo){
          this.rutaModelo = this.baseAPI + '/uploads/' + data.modelo; 
          this.modelo = true;        
        }
        if (data.textura) {
          this.rutaTextura = this.baseAPI + '/uploads/' + data.textura; 
        }
      });

      // Obtener todas las piezas
      this.pieceService.getInfo(id ,this.filtros.idioma.value || 'es').subscribe(data => {
        this.infoPieza = data;
        if (data.audio) {
          this.rutaAudio = environment.apiURL + '/uploads/' + data.audio;
        } else {
          const botonMusica = document.getElementById('boton_musica');
          if (botonMusica) {
            this.ocultarBoton = true;
          }
        }
        for (let piece of this.pieces) {
          console.log(piece.sala_nombre);
          if (piece.id == id) {
            this.salaId = piece.sala_id;
            this.salaService.getOne(this.salaId).subscribe((data) => {
              this.sala = data;
            });
          }
        }
      });
    })

    // Crear escaneo pieza
    const now = new Date();
    this.escaneoService.createNewEscaneosPieza({
      pieza_id: id,
      idioma: idioma
    }).subscribe((data: escaneoPieza) => {
      console.log(data);
      this.escaneo = data;
    });
  }

  onToggleChange(opcion: number,icono: string) {
    console.log('Opción seleccionada:', opcion);
    this.opcion = opcion;
    this.opcionSeleccionadaIcono = icono;
    this.seleccionarOpcion();
  }

  // Función para mostrar el panel de ayuda
  seleccionarOpcion() {
    var contenedor = document.getElementById('descripcion');
    var contenedor2 = document.getElementById('reproductor');
    var contenedor3 = document.getElementById('pictograma');
    //var opciones_texto = document.getElementById('opciones_texto');
    if (this.opcion == 1) {
      if (contenedor && contenedor2 && contenedor3) {
        contenedor.style.display = 'block';
        contenedor2.style.display = 'none';
        contenedor3.style.display = 'none';
        //opciones_texto.style.display = 'block';
      }
    } else if (this.opcion == 2 ) {
      if (contenedor && contenedor2 && contenedor3) {
        contenedor.style.display = 'none';
        contenedor2.style.display = 'block';
        contenedor3.style.display = 'none';
        //opciones_texto.style.display = 'none';
      }
    } else if (this.opcion == 3) {
      if (contenedor && contenedor2 && contenedor3) {
        contenedor.style.display = 'none';
        contenedor2.style.display = 'none';
        contenedor3.style.display = 'block';
        //opciones_texto.style.display = 'none';
      }
    }
  }

  // Función para ocultar el panel de ayuda
  ocultarReproductor() {
    var contenedor = document.getElementById('reproductor');
    if (contenedor) {
      contenedor.style.display = 'none';
    }
  }

  usarMotorGrafico() {
    this.motor_grafico = 1;
  }
 
  // Método que se ejecuta cada 10 segundos
  startTimer() {
    if (!this.isTimerRunning) {
      this.isTimerRunning = true;
      this.timer = setInterval(() => {
        this.tiempo += 5;
        // Aquí colocas el código que quieres que se ejecute cada 10 segundos
        if (this.escaneo && this.escaneo.tiempo !== undefined) {
          this.escaneoService.editarEscaneosPieza(this.escaneo.id, {
            tiempo: this.tiempo,
            motor_grafico: this.motor_grafico,
            audio: this.audio,
          }).subscribe((data: escaneoPieza) => {
            //console.log(data);
          });
        }
      }, 5000); // 10000 milisegundos son 10 segundos
    }
  }

  stopTimer() {
    clearInterval(this.timer);
    this.isTimerRunning = false;
  }

  @HostListener('window:focus')
  onFocus(): void {
    this.startTimer();
  }

  @HostListener('window:blur')
  onBlur(): void {
    this.stopTimer();
  }

  // Método para manejar el evento de reproducción del audio
  reproducir() {
    const botonMusica = document.getElementById('boton_musica');
    if (botonMusica && this.rutaAudio != "") {
      this.audio = 1;
      botonMusica.classList.remove("mdi-play-circle-outline");
      botonMusica.classList.add("mdi-pause-circle-outline");
    }
    console.log('Reproduciendo');
  }

  // Método para manejar el evento de pausa del audio
  pausar() {
    const botonMusica = document.getElementById('boton_musica');
    if (botonMusica && this.rutaAudio != "") {
      botonMusica.classList.add("mdi-play-circle-outline");
      botonMusica.classList.remove("mdi-pause-circle-outline");
    }
    console.log('Parando');
  }

  togglePlay() {
    const miAudio = document.getElementById('miAudio') as HTMLAudioElement;
    const botonMusica = document.getElementById('boton_musica');
  
    if (miAudio && botonMusica && this.rutaAudio != "") {
      if (miAudio.paused) {
        miAudio.play();
        this.audio = 1;
        botonMusica.classList.remove("mdi-play-circle-outline");
        botonMusica.classList.add("mdi-pause-circle-outline");
      } else {
        miAudio.pause();
        botonMusica.classList.add("mdi-play-circle-outline");
        botonMusica.classList.remove("mdi-pause-circle-outline");
      }
    }
  }  

  goToSala(salaId: string) {
    let idioma: string = this.route.snapshot.params['idioma'];
    const ruta = ['pieza/sala', salaId, idioma];
    console.log('Ruta:', ruta);
    this.router.navigate(ruta);
  }  

  registrarUsuario() {
    // Verificar si el usuario ya está registrado en sessionStorage
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    if (usuarioRegistrado !== null) {
      return; // Salir del método si el usuario ya está registrado
    }   
    console.log("Creando usuario");
    this.escaneoService.createNewUsuarioAdulto()
      .subscribe((data: Usuario) => { 
        console.log(data);
        this.escaneo = data;
  
        // Marcar al usuario como registrado en sessionStorage
        sessionStorage.setItem('usuarioRegistrado', 'true');
        sessionStorage.setItem('usuarioRegistradoId', data.id);
      });
  }  

}
