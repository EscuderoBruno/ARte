import {Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import {EngineService} from './engine.service';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.css', '../../../app-style.css']
})
export class EngineComponent implements OnInit {

  @Input() rutaModelo: string = ''; // Título del gráfico
  altura: number = 36;
  iconoExpandir: boolean = true;

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;

  public constructor(private engServ: EngineService) {
  }

  public ngOnInit(): void {

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
    var contenedor_descripcion = document.getElementById("contenedor_informacion");
    var opciones_accesibilidad = document.getElementById("opciones_accesibilidad");
    var contenedor_altura = document.getElementById("altura");
    if (this.iconoExpandir) {
      if (contenedor_motor && contenedor_descripcion && contenedor_altura && opciones_accesibilidad) {
        contenedor_motor.style.height = "70vh";
        contenedor_motor.style.zIndex = "9999";
        contenedor_descripcion.style.display = "none";
        opciones_accesibilidad.style.display = "none";
        contenedor_altura .style.height = "70vh";
        this.iconoExpandir = !this.iconoExpandir;
      }
    } else {
      if (contenedor_motor && contenedor_descripcion && contenedor_altura && opciones_accesibilidad) {
        contenedor_motor.style.height = "35vh";
        contenedor_motor.style.zIndex = "9999";
        contenedor_descripcion.style.display = "block";
        opciones_accesibilidad.style.display = "block";
        contenedor_altura.style.height = "35vh";
        this.iconoExpandir = !this.iconoExpandir;
      }
  }
  }
}
