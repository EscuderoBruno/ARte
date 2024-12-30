// Motor gráfico TAG 
// WithU ARte
// Author: Elías Alfonso Carrasco Guerrero y Elena Sánchez Marín
// Version: 0.9
// Last Updated: 16:00 20/02/2024

//import * as THREE from 'three';
import {ElementRef, Injectable, NgZone, OnDestroy, Component, ViewChild} from '@angular/core';
import {mat4, vec3} from 'gl-matrix';

import {TNodo} from './classes/arbol_de_escena/TNodo';
import {TEntidad} from './classes/arbol_de_escena/TEntidad';
import {TCamara} from './classes/arbol_de_escena/TCamara';
import {TLuz} from './classes/arbol_de_escena/TLuz';
import {TModelo} from './classes/arbol_de_escena/TModelo';

import { TGestorRecursos } from './classes/gestor_de_recursos/TGestorRecursos';
import { TRecursoShader } from './classes/Shaders/TRecursoShader';

import { MotorTag } from './classes/interfaz/MotorTag';




@Injectable({providedIn: 'root'})
export class EngineService implements OnDestroy {
  private canvas!: HTMLCanvasElement;

  public constructor(private ngZone: NgZone) {

    //AHORA LAS PRUEBAS SON EN createScene
        /*
    var nodo_padre = new TNodo();

    var nodo_hijo_1 = new TNodo();
    var nodo_hijo_2 = new TNodo();
    var nodo_hijo_1_1 = new TNodo();


    nodo_padre.addHijo(nodo_hijo_1);
    nodo_padre.addHijo(nodo_hijo_2);

    nodo_hijo_1.addHijo(nodo_hijo_1_1);

    var camara1 = new TCamara(false, 1, 1);
    var camara2 = new TCamara(false, 2, 2);

    var gestor = new TGestorRecursos();

    //const resetButton = document.getElementById('resetButton');
    //console.log(resetButton);
    //this..nativElement 
    
    var path = '/assets/modelos3D/urnas_aves.json';
    var modelo1 = new TModelo(path, gestor);
    //var modelo2 = new TModelo(path, gestor);

    var vector = vec3.create();
    vec3.set(vector, 1, 2, 3);

    var luz1 = new TLuz(vector);

    //nodo_padre.setEntidad(camara1);
    //nodo_hijo_1.setEntidad(camara2);

    nodo_hijo_1_1.setEntidad(modelo1);
    //nodo_hijo_2.setEntidad(modelo2);
    
    nodo_padre.recorrer(mat4.create(), false);
    */

    //modelo1.dibujar();

    /*

    var vector = vec3.create();
    vec3.set(vector, 10, 20, 100);

    //nodo_hijo_1.setTraslacion(vector);
    nodo_padre.recorrer(mat4.create(), false);

    var vectorEscalado = vec3.create();
    vec3.set(vectorEscalado, 8, 8, 8);
    nodo_hijo_1.setEscalado(vectorEscalado);
    nodo_padre.recorrer(mat4.create(), false);

    console.log("VECTOR BEFORE: " + mat4.str(nodo_hijo_1.getMatrizTransf()));

    var meterEscalado = vec3.create();
    vec3.set(meterEscalado, 10, 10, 10);
    nodo_hijo_1.escalar(meterEscalado);

    nodo_padre.recorrer(mat4.create(), false);

    console.log("VECTOR AFTER: " + mat4.str(nodo_hijo_1.getMatrizTransf()));
    
    var pi = 3.1416;
    var grados90 = pi/2;

    //var vectorRotacion = vec3.create();
    //vec3.set(vectorRotacion, 0,  grados90, 0);

    //nodo_hijo_1.setRotacion(vectorRotacion);
    */
    
    /*
    var meterTraslacion = vec3.create();
    vec3.set(meterTraslacion, 40, 40, 40);
    
    var pi = Math.PI;

    var meterRotacion = vec3.create();
    vec3.set(meterRotacion, pi/2, 12.324, 0);

    //nodo_hijo_1.trasladar(meterTraslacion);

    nodo_padre.rotar(meterRotacion);

    nodo_padre.recorrer(mat4.create(), false);

    nodo_hijo_1.print_mat4();
    */

  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    this.canvas = canvas.nativeElement;
    let motor = new MotorTag(this.canvas);

    //CAMARA
    let vector = vec3.create();
    vec3.set(vector, 1, 2, 3);

    let vector006 = vec3.create();
    vec3.set(vector006, 0, 0, 6);

    let cercano = 0.1; let lejano = 100; let aspecto = 1; let anguloVision = 3.1415/2;
    let camara = motor.crearNodoCamara_ConTransformaciones(null, vector006, vector, vector, cercano, lejano, aspecto, anguloVision);

    //LUZ
    let vectorIntensidad = vec3.create();
    vec3.set(vectorIntensidad, 0, 0, 0);
    let luz = motor.crearNodoLuz(null, vectorIntensidad);

    //MALLA
    let path = '/assets/modelos3D/urnas_aves.json';
    let nodoModelo = motor.crearNodoMalla(null, path);

    

    

      /*
    let nodoCamara = motor.crearNodoCamara_ConTransformaciones(null, vector, vector, vector);

    let entidadCamara = nodoCamara.getEntidad();
    if (entidadCamara instanceof TCamara) {
      entidadCamara.setPerspectiva(3.14/2,1);
    }
    */
    //let modelCamara = nodoCamara.getMatrizTransf();
    //let view = modelCamara; //-1
    //let proyection = modelCamara.getProy();

    //let mvp = modelCamara * view * proyection;

    //nodoModelo.recorrer(mat4.create(), false);


    
  }

  public ngOnDestroy(): void {
    /*if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }*/
  }

}



