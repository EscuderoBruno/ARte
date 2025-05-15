import {
  ElementRef,
  Injectable,
  NgZone,
  OnDestroy,
  Component,
  ViewChild,
} from '@angular/core';
import { mat4, vec3 } from 'gl-matrix';

import { TNodo } from './classes/arbol_de_escena/TNodo';

import { MotorTag } from './classes/interfaz/MotorTag';
import * as Hammer from 'hammerjs';
import { TCamara } from './classes/arbol_de_escena/TCamara';

@Injectable({ providedIn: 'root' })
export class EngineService implements OnDestroy {
  private canvas!: HTMLCanvasElement;
  private modelo!: TNodo;
  private camara!: TNodo;

  public constructor() {}

  public createScene(
    canvas: ElementRef<HTMLCanvasElement>,
    rutaModelo: string,
    rutaTextura: string
  ): void {
    this.canvas = canvas.nativeElement;
    let motor = new MotorTag(this.canvas);

    //CAMARA
    let vector = vec3.create();
    vec3.set(vector, 0, 0, 0);

    let vector000 = vec3.create();
    vec3.set(vector000, 0, 0, 0);

    let cercano = 0.1;
    let lejano = 100;
    let aspecto = this.canvas.width / this.canvas.height;
    let anguloVision = 3.1415 / 2;
    let camara = motor.crearNodoCamara_ConTransformaciones(
      null,
      vector000,
      vector,
      vector,
      cercano,
      lejano,
      aspecto,
      anguloVision
    );

    this.camara = camara;

    //LUZ
    let vec3_color = vec3.create();
    vec3_color = [1, 1, 1];

    let itensidad = 1;

    let vec3_direccion = vec3.create();
    vec3_direccion = [0.0, 0.0, -1.0];

    let luz = motor.crearNodoLuz(null, vec3_color, itensidad, vec3_direccion);

    //MALLA

    /*
    let ruta_modelo = '/assets/modelos3D/cubo1.obj';
    let ruta_textura = '/assets/images/cubo1.jpg';
    let ruta_material = '/assets/modelos3D/cubo1.mtl';
    */

    let ruta_modelo = '/assets/modelos3D/plato.obj';
    let ruta_textura = '/assets/images/glass.jpg';
    let ruta_material = '/assets/modelos3D/cubo1.mtl';

    // let ruta_modelo = '/assets/modelos3D/lucerna.obj';
    // let ruta_textura = '/assets/images/glass.jpg';
    // let ruta_material = '/assets/modelos3D/cubo1.mtl';

    // let nodoModelo = motor.crearNodoMalla(
    //   null,
    //   ruta_modelo,
    //   ruta_textura,
    //   ruta_material
    // );
    let nodoModelo = motor.crearNodoMalla(
      null,
      rutaModelo,
      rutaTextura,
      ruta_material
    );
    this.modelo = nodoModelo;

    let vec3_traslacion_camara = vec3.create();
    vec3.set(vec3_traslacion_camara, 0, 0, 1);
    camara.setTraslacion(vec3_traslacion_camara);

    motor.recorrerNodoEscena();
  }

  public setAspecto(aspecto: number){
    let entidad_camara = this.camara.getEntidad()
    if(entidad_camara instanceof TCamara) {
      entidad_camara.setAspecto(aspecto);
    }
  }

  public resetObject(): void{
    //Ejecutarla cuando se detcta click en el boton reset
    let vec3_traslacion_y_rotacion_inicial = vec3.create();
    vec3.set(vec3_traslacion_y_rotacion_inicial, 0, 0, 0);

    let vec3_escalado_inicial = vec3.create();
    vec3.set(vec3_escalado_inicial, 1, 1, 1);

    //this.modelo.setTraslacion(vec3_traslacion_y_rotacion_inicial);
    this.modelo.setRotacion(vec3_traslacion_y_rotacion_inicial);
    this.modelo.setEscalado(vec3_escalado_inicial);
  }

  public rotateObject(deltaX: number, deltaY: number): void {
    let v = vec3.create();
    vec3.set(v, deltaX, deltaY, 0);
    this.modelo.rotar(v);
  }

  public rotarConRaton(): void {
    let mouseX = 0;
    let mouseY = 0;
    let isClicked = false;

    this.canvas.addEventListener('mousedown', (event) => {
      isClicked = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    this.canvas.addEventListener('mouseup', () => {
      isClicked = false;
    });

    this.canvas.addEventListener('mousemove', (event) => {
      if (isClicked) {
        const deltaX = event.clientX - mouseX;
        const deltaY = event.clientY - mouseY;
        mouseX = event.clientX;
        mouseY = event.clientY;

        this.rotateObject(deltaY * 0.01, deltaX * 0.01);
      }
    });

    this.canvas.addEventListener('wheel', (event) => {
      let zoomLevel = 1;
      if (event.deltaY < 0) {
        // Zoom in
        zoomLevel *= 1.15;
      } else {
        // Zoom out
        zoomLevel /= 1.15;
      }
      this.modelo.escalar(vec3.fromValues(zoomLevel, zoomLevel, zoomLevel));
      event.preventDefault();
    });
  }

  public eventosMovil() {
    let mc = new Hammer.Manager(this.canvas);

    var Rotar = new Hammer.Rotate({
      enable: true,
      threshold: 0.1,
      pointers: 3,
      event: 'mover',
    });
    var Mover = new Hammer.Pan({
      direction: Hammer.DIRECTION_ALL,
      event: 'rotar',
    });
    var Zoom = new Hammer.Pinch({
      enable: true,
      threshold: 0.1,
      event: 'zoom',
    });

    mc.add(Zoom);
    mc.add(Mover);
    mc.add(Rotar);

    mc.on('zoom', (e) => {
      let scale = e.scale;
      scale = scale > 1 ? 1.02 : 0.98;
      this.modelo.escalar(vec3.fromValues(scale, scale, scale));
    });

    mc.on('rotar', (e) => {
      // Calcula la rotación basada en el movimiento táctil

      let X = e.deltaX * 0.0005;
      let Y = e.deltaY * 0.0005;

      X = X > 0.02 ? 0.02 : X;
      Y = Y > 0.02 ? 0.02 : Y;

      this.rotateObject(Y, X);
    });

    mc.on('mover', (e) => {
      let X = e.deltaX * 0.0005;
      let Y = e.deltaY * 0.0005;

      this.modelo.trasladar(vec3.fromValues(Y, X, 0));
    });
  }

  public rotarConMovil(): void {
    let initialTouchX = 0;
    let initialTouchY = 0;

    // Variables para almacenar la posición actual del toque
    let currentTouchX = 0;
    let currentTouchY = 0;

    // Variable para almacenar si el usuario está tocando la pantalla
    let isTouching = false;

    // Variables para almacenar las transformaciones
    let rotation = [0, 0];

    this.canvas.addEventListener('touchstart', (event) => {
      isTouching = true;
      initialTouchX = event.touches[0].clientX;
      initialTouchY = event.touches[0].clientY;
    });

    this.canvas.addEventListener('touchend', (event) => {
      isTouching = false;
    });

    this.canvas.addEventListener('touchmove', (event) => {
      if (isTouching) {
        currentTouchX = event.touches[0].clientX;
        currentTouchY = event.touches[0].clientY;

        // Calcula la rotación basada en el movimiento táctil
        rotation[0] = (currentTouchY - initialTouchY) * 0.01;
        rotation[1] = (currentTouchX - initialTouchX) * 0.01;

        // Actualiza la posición inicial del toque
        initialTouchX = currentTouchX;
        initialTouchY = currentTouchY;

        // Rotar objeto
        this.rotateObject(rotation[0], rotation[1]);
      }
    });
  }

  public ngOnDestroy(): void {
    /*if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }*/
  }
}
