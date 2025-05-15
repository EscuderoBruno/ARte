import { mat4, vec3, vec2 } from 'gl-matrix';

import { TNodo } from '../../classes/arbol_de_escena/TNodo';
import { TEntidad } from '../../classes/arbol_de_escena/TEntidad';
import { TCamara } from '../../classes/arbol_de_escena/TCamara';
import { TLuz } from '../../classes/arbol_de_escena/TLuz';
import { TModelo } from '../../classes/arbol_de_escena/TModelo';

import { TGestorRecursos } from '../../classes/gestor_de_recursos/TGestorRecursos';
import { TRecursoShader } from '../../classes/gestor_de_recursos/TRecursoShader';

export class MotorTag {
  private canvas!: HTMLCanvasElement;
  protected gl!: WebGLRenderingContext | null;

  private nodo_raiz!: TNodo;

  private camara!: TNodo;
  private luz!: TNodo;
  private malla!: TNodo;

  private viewProjectionMatrix!: mat4;

  private programId!: WebGLProgram | null;

  private gestor!: TGestorRecursos;

  //private luces
  //private ...
  //Atributos para mantenimiento de las cámaras, luces y viewports

  constructor(canvas: HTMLCanvasElement) {
    this.checkInitCanvas(canvas);
    this.checkInitGl(canvas);

    this.nodo_raiz = new TNodo();

    //SHADERS
    let shader = new TRecursoShader(this.canvas);
    this.programId = shader.setShaders();

    this.gestor = new TGestorRecursos();
  }

  private checkInitCanvas(canvas: HTMLCanvasElement): void {
    const pruebaCanvas = canvas;
    if (!pruebaCanvas) {
      throw new Error(`No se encontró el elemento canvas con el ID: ${canvas}`);
    } else {
      /*console.log("canvas inicializado correctamente");*/
    }

    this.canvas = canvas;
  }

  private checkInitGl(canvas: HTMLCanvasElement): void {
    const pruebaGl = canvas.getContext('webgl');
    if (!pruebaGl) {
      throw new Error('WebGL no está disponible en este navegador.');
    } else {
      /*console.log("gl inicializado correctamente");*/
    }

    this.gl = canvas.getContext('webgl');
  }

  public crearNodoCamara_ConTransformaciones(
    nodo_padre: any,
    traslacion: vec3,
    rotacion: vec3,
    escalado: vec3,
    cercano: number,
    lejano: number,
    aspecto: number,
    anguloVision: number
  ): TNodo {
    if (!(nodo_padre instanceof TNodo)) {
      nodo_padre = this.nodo_raiz;
    }

    let nodo = new TNodo();

    if(this.gl && this.programId){
      let camara = new TCamara(this.gl, this.programId, true, cercano, lejano, aspecto, anguloVision);
      this.setNodeTransformations(nodo, escalado, traslacion, rotacion);
      this.asignarCamaraPadreYMotor(nodo_padre, nodo, camara);
    }

    //console.log(nodo);
    return nodo;
  }

  public crearNodoCamara(
    nodo_padre: any,
    esPerspectiva: boolean,
    cercano: number,
    lejano: number,
    aspecto: number,
    anguloVision: number
  ): TNodo {
    if (!(nodo_padre instanceof TNodo)) {
      nodo_padre = this.nodo_raiz;
    }

    let nodo = new TNodo();

    if(this.gl && this.programId){
      let camara = new TCamara(this.gl, this.programId, true, cercano, lejano, aspecto, anguloVision);
      this.asignarCamaraPadreYMotor(nodo_padre, nodo, camara);
    }

    return nodo;
  }

  private asignarCamaraPadreYMotor(
    nodo_padre: TNodo,
    nodo: TNodo,
    camara: TCamara
  ): void {
    this.viewProjectionMatrix = camara.getProjectionMatrix();

    nodo.setEntidad(camara);
    nodo.setEngine(this);

    nodo_padre.addHijo(nodo);
    nodo.setPadre(nodo_padre);

    this.camara = nodo;
  }

  private setNodeTransformations(
    nodo: TNodo,
    escalado: vec3,
    traslacion: vec3,
    rotacion: vec3
  ): void {
    nodo.setEscalado(escalado);
    nodo.setTraslacion(traslacion);
    nodo.setRotacion(rotacion);
    nodo.setActualizarMatriz(true);
  }

  //----------------------------------------- LUZ --------------------------------------------------

  public crearNodoLuz(nodo_padre: any, color: vec3 , intensidad: number, direccion: vec3): TNodo {
    if (!(nodo_padre instanceof TNodo)) {
      nodo_padre = this.nodo_raiz;
    }
    let nodo = new TNodo();
    if(this.gl && this.programId){
      let luz = new TLuz(this.gl, this.programId, color, intensidad, direccion);
      this.asignarLuzPadreYMotor(nodo_padre, nodo, luz);
    }

    return nodo;
  }

  private asignarLuzPadreYMotor(
    nodo_padre: TNodo,
    nodo: TNodo,
    luz: TEntidad
  ): void {
    nodo.setEntidad(luz);
    nodo.setEngine(this);

    nodo_padre.addHijo(nodo);
    nodo.setPadre(nodo_padre);

    this.luz = nodo;
  }

  /*
  public crearNodoLuz_ConTransformaciones(
    nodo_padre: any,
    traslacion: vec3,
    rotacion: vec3,
    escalado: vec3
  ): TNodo {
    if (!(nodo_padre instanceof TNodo)) {
      nodo_padre = this.nodo_raiz;
    }

    let nodo = new TNodo();
    if(this.gl && this.programId){
      let luz = new TLuz(this.gl, this.programId);
      this.asignarLuzPadreYMotor(nodo_padre, nodo, luz);
    }

    this.setNodeTransformationsLuz(nodo, escalado, traslacion, rotacion);
    //console.log(nodo);
    return nodo;
  }
  */

  private setNodeTransformationsLuz(
    nodo: TNodo,
    escalado: vec3,
    traslacion: vec3,
    rotacion: vec3
  ): void {
    nodo.setEscalado(escalado);
    nodo.setTraslacion(traslacion);
    nodo.setRotacion(rotacion);
    nodo.setActualizarMatriz(true);
  }

  public recorrerNodoEscena() {
    this.nodo_raiz.recorrer(mat4.create(), false);
    requestAnimationFrame(() => {
      this.recorrerNodoEscena();
    });
  }

  //----------------------------------------- MALLA --------------------------------------------------
  public crearNodoMalla(nodo_padre: any, ruta_modelo: string, ruta_textura: string, ruta_material: string): TNodo {
    if (!(nodo_padre instanceof TNodo)) {
      nodo_padre = this.nodo_raiz;
    }

    let nodo = new TNodo();
    //let gestor = new TGestorRecursos();
    let modelo = new TModelo(
      ruta_modelo,
      ruta_textura,
      ruta_material,
      this.gestor,
      this.gl,
      this.viewProjectionMatrix,
      this.programId
    );

    this.asignarMallaPadreYMotor(nodo_padre, nodo, modelo);

    let traslacion = vec3.create();
    vec3.set(traslacion, 0, 0, 0);
    nodo.trasladar(traslacion);

    return nodo;
  }

  private asignarMallaPadreYMotor(
    nodo_padre: TNodo,
    nodo: TNodo,
    malla: TEntidad
  ): void {
    nodo.setEntidad(malla);
    nodo.setEngine(this);

    nodo_padre.addHijo(nodo);
    nodo.setPadre(nodo_padre);

    this.malla = nodo;
  }

  public crearNodoMalla_ConTransformaciones(
    nodo_padre: any,
    ruta_modelo: string,
    ruta_textura: string,
    ruta_material: string,
    traslacion: vec3,
    rotacion: vec3,
    escalado: vec3
  ): TNodo {
    if (!(nodo_padre instanceof TNodo)) {
      nodo_padre = this.nodo_raiz;
    }

    let nodo = new TNodo();
    let modelo = new TModelo(
      ruta_modelo,
      ruta_textura,
      ruta_material,
      this.gestor,
      this.gl,
      this.viewProjectionMatrix,
      this.programId
    );

    this.setNodeTransformationsMalla(nodo, escalado, traslacion, rotacion);
    this.asignarMallaPadreYMotor(nodo_padre, nodo, modelo);
    //console.log(nodo);
    return nodo;
  }

  private setNodeTransformationsMalla(
    nodo: TNodo,
    escalado: vec3,
    traslacion: vec3,
    rotacion: vec3
  ): void {
    nodo.setEscalado(escalado);
    nodo.setTraslacion(traslacion);
    nodo.setRotacion(rotacion);
    nodo.setActualizarMatriz(true);
  }

  getGl() {
    return this.gl;
  }

  getProgram() {
    return this.programId;
  }

  public dibujarEscena(): void {}
}
