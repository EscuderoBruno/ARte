import {Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
//import {self_engine} from './self_engine.service';
import { EngineService } from './self_engine.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-self-engine',
  templateUrl: './self-engine.component.html',
  styleUrl: './self-engine.component.css',
})
export class SelfEngineComponent {
  @Input() rutaModelo: string = ''; // Título del gráfico
  @Input() rutaTextura: string = ''; // Título del gráfico
  altura: number = 36;
  iconoExpandir: boolean = true;

  informacionAyudaGeneral: any;
  informacionAyuda = {
    espanol: [
      {
        rotar: {
          icono: "mdi mdi-autorenew mdi-ayuda",
          titulo: "Rotar",
          descripcion: "Click izquierdo + arrastrar o Arrastre con un dedo"
        },
        zoom: {
          icono: "mdi mdi-magnify-plus-outline mdi-ayuda",
          titulo: "Zoom",
          descripcion: "Desplazarse en cualquier lugar o Pellizcar"
        },
        mover: {
          icono: "mdi mdi-arrow-all mdi-ayuda",
          titulo: "Mover",
          descripcion: "Click derecho + arrastrar o Arrastre con dos dedos"
        }
      }
    ],
    ingles: [
      {
        rotar: {
          icono: "mdi mdi-autorenew mdi-ayuda",
          titulo: "Rotate",
          descripcion: "Left click + drag or Drag with one finger"
        },
        zoom: {
          icono: "mdi mdi-magnify-plus-outline mdi-ayuda",
          titulo: "Zoom",
          descripcion: "Scroll anywhere or Pinch"
        },
        mover: {
          icono: "mdi mdi-arrow-all mdi-ayuda",
          titulo: "Move",
          descripcion: "Right click + drag or Drag with two fingers"
        }
      }
    ],
    valenciano: [
      {
        rotar: {
          icono: "mdi mdi-autorenew mdi-ayuda",
          titulo: "Rotar",
          descripcion: "Clic esquerre + arrossegar o Arrossegar amb un dit"
        },
        zoom: {
          icono: "mdi mdi-magnify-plus-outline mdi-ayuda",
          titulo: "Zoom",
          descripcion: "Desplaçar-se en qualsevol lloc o Pellizcar"
        },
        mover: {
          icono: "mdi mdi-arrow-all mdi-ayuda",
          titulo: "Moure",
          descripcion: "Clic dret + arrossegar o Arrossegar amb dos dits"
        }
      }
    ]
  };  

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;

  public constructor(private engServ: EngineService,
    private route: ActivatedRoute, 
    private router: Router ) {
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
    console.log('Ruta textura:', this.rutaTextura);
    this.setCanvasSize(this.rendererCanvas)
    //this.engServ.createScene(this.rendererCanvas);
    this.engServ.createScene(this.rendererCanvas, this.rutaModelo, this.rutaTextura);
    this.engServ.rotarConRaton();
    //this.engServ.rotarConMovil();
    this.engServ.eventosMovil();

    //this.engServ.animate();
    }

    setCanvasSize(canvas: ElementRef<HTMLCanvasElement>){

      const contenedorPadre = document.getElementById('padre-canvas');
      const h = contenedorPadre?.clientHeight || 300;
      const w = contenedorPadre?.clientWidth || 300;
  
      console.log(contenedorPadre, h, w);
  
      canvas.nativeElement.setAttribute('width', w.toString())
      canvas.nativeElement.setAttribute('height', h.toString())
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
      const contenedorPadre = document.getElementById('padre-canvas');
      const h = contenedorPadre?.clientHeight || 300;
      const w = contenedorPadre?.clientWidth || 300;
      if (this.iconoExpandir) {
        this.engServ.setAspecto(h/w);
        if (contenedor_motor && contenedor_informacion && contenedor_altura) {
          contenedor_motor.style.height = "calc(100dvh - 50px - 71px - 30px)";
          contenedor_motor.style.zIndex = "9999";
          contenedor_informacion.style.visibility = "hidden";
          contenedor_altura.style.height = "calc(100dvh - 50px - 71px - 30px)";
          this.iconoExpandir = !this.iconoExpandir;
        }
      } else {
        this.engServ.setAspecto(h/w);
        if (contenedor_motor && contenedor_informacion && contenedor_altura) {
          contenedor_motor.style.height = "36dvh";
          contenedor_motor.style.zIndex = "9999";
          contenedor_informacion.style.visibility = "visible";
          contenedor_altura.style.height = "36dvh";
          this.iconoExpandir = !this.iconoExpandir;
        }
      }
    }

    resetPosition() {
      this.engServ.resetObject();
    }
}
