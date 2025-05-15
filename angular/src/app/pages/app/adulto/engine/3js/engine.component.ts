import {Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import {EngineService} from './engine.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.css', '../../../app-style.css']
})
export class EngineComponent implements OnInit {

  @Input() rutaModelo: string = ''; // Título del gráfico
  altura: number = 36;
  iconoExpandir: boolean = true;

  informacionAyudaGeneral: any;
  informacionAyuda = {
    espanol: [
      {
        rotar: {
          icono: "mdi mdi-autorenew mdi-ayuda",
          titulo: "Rotar",
          descripcion: "Click izquierdo + arrastrar o Arrastre con un dedo (toque)"
        },
        zoom: {
          icono: "mdi mdi-magnify-plus-outline mdi-ayuda",
          titulo: "Zoom",
          descripcion: "Doble click en el modelo o desplazarse en cualquier lugar o Pellizcar (toque)"
        },
        mover: {
          icono: "mdi mdi-arrow-all mdi-ayuda",
          titulo: "Mover",
          descripcion: "Click derecho + arrastrar o Arrastre con dos dedos (toque)"
        }
      }
    ],
    ingles: [
      {
        rotar: {
          icono: "mdi mdi-autorenew mdi-ayuda",
          titulo: "Rotate",
          descripcion: "Left click + drag or Drag with one finger (touch)"
        },
        zoom: {
          icono: "mdi mdi-magnify-plus-outline mdi-ayuda",
          titulo: "Zoom",
          descripcion: "Double click on the model or scroll anywhere or Pinch (touch)"
        },
        mover: {
          icono: "mdi mdi-arrow-all mdi-ayuda",
          titulo: "Move",
          descripcion: "Right click + drag or Drag with two fingers (touch)"
        }
      }
    ],
    valenciano: [
      {
        rotar: {
          icono: "mdi mdi-autorenew mdi-ayuda",
          titulo: "Rotar",
          descripcion: "Clic esquerre + arrossegar o Arrossegar amb un dit (toc)"
        },
        zoom: {
          icono: "mdi mdi-magnify-plus-outline mdi-ayuda",
          titulo: "Zoom",
          descripcion: "Doble clic en el model o desplaçar-se en qualsevol lloc o Pellizcar (toc)"
        },
        mover: {
          icono: "mdi mdi-arrow-all mdi-ayuda",
          titulo: "Moure",
          descripcion: "Clic dret + arrossegar o Arrossegar amb dos dits (toc)"
        }
      }
    ]
  };  

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;

  public constructor(private engServ: EngineService,
    private route: ActivatedRoute, 
    private router: Router, ) {
  }

  public ngOnInit(): void {

    let idioma: string = this.route.snapshot.params['idioma'];

    if (idioma == 'es') {
      this.informacionAyudaGeneral = this.informacionAyuda.espanol[0]; // Información en español
    } else if (idioma == "en") {
      this.informacionAyudaGeneral = this.informacionAyuda.ingles[0]; // Información en español
    } else if (idioma == "va") {
      this.informacionAyudaGeneral = this.informacionAyuda.valenciano[0]; // Información en español
    }

    console.log('Ruta modelo:', this.rutaModelo);

    this.engServ.createScene(this.rendererCanvas);
    this.engServ.animate();
    this.engServ.create3DObject(this.rutaModelo);
  }

  // Función para mostrar el panel de ayuda
  mostrarPanelAyuda() {
    var contenedor = document.getElementById('panelAyuda');
    if (contenedor) {
      contenedor.style.display = 'block';
    }
  }

  // Función para ocultar el panel de ayuda
  ocultarPanelAyuda() {
    var contenedor = document.getElementById('panelAyuda');
    if (contenedor) {
      contenedor.style.display = 'none';
    }
  }

  expandirContenedor() {
    var contenedor_motor = document.getElementById("contenedor-motor");
    var contenedor_informacion = document.getElementById("contenedor_informacion");
    var contenedor_altura = document.getElementById("altura");
    if (this.iconoExpandir) {
      if (contenedor_motor && contenedor_informacion && contenedor_altura) {
        contenedor_motor.style.height = "76dvh";
        contenedor_motor.style.zIndex = "9999";
        contenedor_informacion.style.visibility = "hidden";
        contenedor_altura .style.height = "76dvh";
        this.iconoExpandir = !this.iconoExpandir;
      }
    } else {
      if (contenedor_motor && contenedor_informacion && contenedor_altura) {
        contenedor_motor.style.height = "36dvh";
        contenedor_motor.style.zIndex = "9999";
        contenedor_informacion.style.visibility = "visible";
        contenedor_altura.style.height = "36dvh";
        this.iconoExpandir = !this.iconoExpandir;
      }
    }
  }
}
