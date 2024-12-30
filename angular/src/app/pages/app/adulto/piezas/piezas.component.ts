import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieceService } from '../../../admin/piezas/pieza-servicio.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Pieza, PiezaLista } from '../../../admin/piezas/pieza-servicio.service';
import { escaneoPieza, escaneoService } from '../../../../services/escaneo.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Idioma, IdiomaService } from '../../../../services/idioma.service';

import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-piezas',
  templateUrl: './piezas.component.html',
  styleUrl: './piezas.component.css'
})

export class PiezasComponent {

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

  pieces: PiezaLista[] = [];
  pieza: Pieza | null = null;
  idiomas: Idioma[] = [];
  escaneoPieza: escaneoPieza[] = [];
  salaNombre: string = '';
  rutaModelo: string = '';

  filtros = {
    nombre: new FormControl(''),
    sala: new FormControl('0'),
    numero: new FormControl(10),
    pagina: 1,
    idioma: new FormControl(''),
  }

  constructor(
    private pieceService: PieceService,
    private idiomaService: IdiomaService,
    private escaneoService: escaneoService,
    private route: ActivatedRoute, 
    
  ) {
    // Llamar al método que se ejecutará cada 10 segundos
    this.startTimer();
  }

  ngOnInit(): void {

    let id: string = this.route.snapshot.params['id'];
    this.rutaModelo = this.baseAPI + '/uploads/piezas/modelos/' + id + '.glb'; 

    this.idiomaService.getAll().subscribe(idiomasDisponibles => {

        this.idiomas = idiomasDisponibles;
        this.filtros.idioma.setValue(idiomasDisponibles[0].id)

      // Obtener la pieza
      this.pieceService.getOne(id).subscribe(data => {
        this.pieza = data;
      });

      // Obtener todas las piezas
      this.pieceService.getLista(this.filtros.idioma.value || 'es', this.filtros).subscribe(data => {
        this.pieces = data.piezas;
        for (let piece of this.pieces) {
          console.log(piece.sala_nombre);
          if (piece.id == id) {
            this.salaNombre = piece.sala_nombre;
          }
        }
      });
    })

    // Obtener todos los escaneos piezas
    this.escaneoService.getAllEscaneosPieza("").subscribe(data => {
      this.escaneoPieza = data;
      console.log(this.escaneoPieza);
    });

    // Crear escaneo pieza
    const now = new Date();
    this.escaneoService.createNewEscaneosPieza({
      pieza_id: id,
    }).subscribe((data: escaneoPieza) => {
      console.log(data);
      this.escaneo = data;
    });
    
    console.log(this.salaNombre);

  }

  onToggleChange(opcion: number,icono: string) {
    console.log('Opción seleccionada:', opcion);
    this.opcion = opcion;
    this.opcionSeleccionadaIcono = icono;
    this.seleccionarOpcion();
  }

  // Función para mostrar el panel de ayuda
  seleccionarOpcion() {
    var contenedor = document.getElementById('reproductor');
    var contenedor2 = document.getElementById('descripcion');
    //var opciones_texto = document.getElementById('opciones_texto');
    if (this.opcion == 1) {
      if (contenedor && contenedor2) {
        contenedor.style.display = 'none';
        contenedor2.style.display = 'block';
        //opciones_texto.style.display = 'block';
      }
    } else if (this.opcion == 3) {
      if (contenedor && contenedor2) {
        contenedor.style.display = 'block';
        contenedor2.style.display = 'none';
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
        this.tiempo++;
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

  togglePlay() {
    const miAudio = document.getElementById('miAudio') as HTMLAudioElement;
    const botonMusica = document.getElementById('boton_musica');
  
    if (miAudio && botonMusica) {
      if (miAudio.paused) {
        miAudio.play();
        botonMusica.classList.remove("mdi-play-circle-outline");
        botonMusica.classList.add("mdi-pause-circle-outline");
      } else {
        miAudio.pause();
        botonMusica.classList.add("mdi-play-circle-outline");
        botonMusica.classList.remove("mdi-pause-circle-outline");
      }
    }
  }  

}
