/*
VARIABLES
canvas: HTMLCanvasElement;
gl: WebGLRenderingContext | null;

gestor_recursos: TGestorRecursos;
nodo_raiz: TNodo;

camara: TNodo
----------------------------------------------------------------
FUNCIONES
constructor (HTMLCanvasElement)

checkInitCanvas (HTMLCanvasElement)
checkInitGl (HTMLCanvasElement)

crearNodoCamara_ConTransformaciones (TNodo, vec3, vec3, vec3) TNodo
crearNodoCamara (TNodo) TNodo

FA

setNodeTransformations (TNodo, vec3, vec3, vec3)

dibujarEscena()
*/


import {mat4, vec3, vec2} from 'gl-matrix';

import {TNodo} from '../../classes/arbol_de_escena/TNodo';
import {TEntidad} from '../../classes/arbol_de_escena/TEntidad';
import {TCamara} from '../../classes/arbol_de_escena/TCamara';
import {TLuz} from '../../classes/arbol_de_escena/TLuz';
import {TModelo} from '../../classes/arbol_de_escena/TModelo';

import { TGestorRecursos } from '../../classes/gestor_de_recursos/TGestorRecursos';
import { TRecursoShader } from '../../classes/Shaders/TRecursoShader';
import { TMalla } from '../gestor_de_recursos/TMalla';
import { TRecursoModelo } from '../gestor_de_recursos/TRecursoModelo';

export class MotorTag {
    private canvas!: HTMLCanvasElement;
    protected gl!: WebGLRenderingContext | null;

    private gestor_recursos!: TGestorRecursos;
    private nodo_raiz!: TNodo;

    private camara!: TNodo;
    private luz!: TNodo;
    private malla!: TNodo;

    private viewProjectionMatrix!: mat4;

    private programId!: WebGLProgram | null;

    //private luces
    //private ...
    //Atributos para mantenimiento de las cámaras, luces y viewports

    constructor(canvas: HTMLCanvasElement) {       
        this.checkInitCanvas(canvas);
        this.checkInitGl(canvas);
        this.gestor_recursos = new TGestorRecursos();

        this.nodo_raiz = new TNodo();

        /*PRUEBAS*/
        this.canvas.innerHTML = 'wuola'; 
        this.canvas.style.backgroundColor = 'rgba(0,0,0,1)';

        //SHADERS
        let shader = new TRecursoShader(this.canvas);
        this.programId = shader.setShaders();
    }


    private checkInitCanvas(canvas: HTMLCanvasElement): void {
        const pruebaCanvas = canvas;
        if (!pruebaCanvas) {
            throw new Error(`No se encontró el elemento canvas con el ID: ${canvas}`);
        } else { /*console.log("canvas inicializado correctamente");*/}

        this.canvas = canvas;
    }

    private checkInitGl(canvas: HTMLCanvasElement): void {
        const pruebaGl = canvas.getContext('webgl');
        if (!pruebaGl) {
            throw new Error('WebGL no está disponible en este navegador.');
        } else {/*console.log("gl inicializado correctamente");*/}

        this.gl = canvas.getContext('webgl');
    }

    public crearNodoCamara_ConTransformaciones(nodo_padre: any, traslacion: vec3, rotacion: vec3, escalado: vec3, cercano: number, lejano: number, aspecto: number, anguloVision: number): TNodo {
        if(!(nodo_padre instanceof  TNodo)) {
            nodo_padre = this.nodo_raiz;
        }
        
        let nodo = new TNodo();

        let camara = new TCamara(true, cercano, lejano, aspecto, anguloVision);

        this.setNodeTransformations(nodo, escalado, traslacion, rotacion);

        this.asignarCamaraPadreYMotor(nodo_padre, nodo, camara);
        //console.log(nodo);
        return nodo;
    }

    public crearNodoCamara(nodo_padre: any, esPerspectiva: boolean, cercano: number, lejano: number, aspecto: number, anguloVision: number): TNodo {
        if(!(nodo_padre instanceof  TNodo)) {
            nodo_padre = this.nodo_raiz;
        }

        let nodo = new TNodo();

        let camara = new TCamara(true, cercano, lejano, aspecto, anguloVision);

        this.asignarCamaraPadreYMotor(nodo_padre, nodo, camara);

        return nodo;
    }

    private asignarCamaraPadreYMotor(nodo_padre: TNodo, nodo: TNodo, camara: TCamara): void {
        this.viewProjectionMatrix = camara.getViewProjectionMatrix();

        nodo.setEntidad(camara);
        nodo.setEngine(this);

        nodo_padre.addHijo(nodo);
        nodo.setPadre(nodo_padre);
        
        this.camara = nodo;
    }

    private setNodeTransformations(nodo: TNodo, escalado: vec3, traslacion: vec3, rotacion: vec3): void {
        nodo.setEscalado(escalado);
        nodo.setTraslacion(traslacion);
        nodo.setRotacion(rotacion);
        nodo.setActualizarMatriz(true);
    }

//----------------------------------------- LUZ --------------------------------------------------

    public crearNodoLuz (nodo_padre: any, intensidad: vec3): TNodo{
        if(!(nodo_padre instanceof  TNodo)) {
            nodo_padre = this.nodo_raiz;
        }
        let nodo = new TNodo();
        let luz = new TLuz([0, 0, 0]);

        this.asignarLuzPadreYMotor(nodo_padre, nodo, luz);

        return nodo;
    }

    private asignarLuzPadreYMotor(nodo_padre: TNodo, nodo: TNodo, luz: TEntidad): void {
        nodo.setEntidad(luz);
        nodo.setEngine(this);

        nodo_padre.addHijo(nodo);
        nodo.setPadre(nodo_padre);
        
        this.luz = nodo;
    }

    public crearNodoLuz_ConTransformaciones(nodo_padre: any, traslacion: vec3, rotacion: vec3, escalado: vec3): TNodo {
        if(!(nodo_padre instanceof  TNodo)) {
            nodo_padre = this.nodo_raiz;
        }
        
        let nodo = new TNodo();
        let luz = new TLuz([0, 0, 0]);

        this.setNodeTransformationsLuz(nodo, escalado, traslacion, rotacion);
        this.asignarLuzPadreYMotor(nodo_padre, nodo, luz);
        //console.log(nodo);
        return nodo;
    }

    private setNodeTransformationsLuz(nodo: TNodo, escalado: vec3, traslacion: vec3, rotacion: vec3): void {
        nodo.setEscalado(escalado);
        nodo.setTraslacion(traslacion);
        nodo.setRotacion(rotacion);
        nodo.setActualizarMatriz(true);
    }



//----------------------------------------- MALLA --------------------------------------------------
    public crearNodoMalla(nodo_padre: any, fichero: string): TNodo {
        if(!(nodo_padre instanceof  TNodo)) {
            nodo_padre = this.nodo_raiz;
        }

        let nodo = new TNodo();
        let gestor = new TGestorRecursos();
        let modelo = new TModelo(fichero, gestor, this.gl, this.viewProjectionMatrix, this.programId);

        this.asignarMallaPadreYMotor(nodo_padre, nodo, modelo);

        return nodo;
    }

    private asignarMallaPadreYMotor(nodo_padre: TNodo, nodo: TNodo, malla: TEntidad): void {
        nodo.setEntidad(malla);
        nodo.setEngine(this);

        nodo_padre.addHijo(nodo);
        nodo.setPadre(nodo_padre);
        
        this.malla = nodo;
    }

    public crearNodoMalla_ConTransformaciones(fichero: string, gestor: TGestorRecursos, nodo_padre: any, traslacion: vec3, rotacion: vec3, escalado: vec3): TNodo {
        if(!(nodo_padre instanceof  TNodo)) {
            nodo_padre = this.nodo_raiz;
        }
        
        let nodo = new TNodo();
        let modelo = new TModelo(fichero, gestor, this.gl, this.viewProjectionMatrix, this.programId);

        this.setNodeTransformationsMalla(nodo, escalado, traslacion, rotacion);
        this.asignarMallaPadreYMotor(nodo_padre, nodo, modelo);
        //console.log(nodo);
        return nodo;
    }

    private setNodeTransformationsMalla(nodo: TNodo, escalado: vec3, traslacion: vec3, rotacion: vec3): void {
        nodo.setEscalado(escalado);
        nodo.setTraslacion(traslacion);
        nodo.setRotacion(rotacion);
        nodo.setActualizarMatriz(true);
    }


    public dibujarEscena(): void {}
}





/*
TLuz *crearLuz (…)
TMalla *crearMalla (char *fichero, …)
void dibujarEscena (…)

bool actualizarLuz, actualizarCamara
Métodos para el registro y manejo de las cámaras
Métodos para el registro y manejo de las luces
Métodos para el registro y manejo de los viewports
----------------------------------------------------------------------------------
TNodo *TMotorTAG :: crearNodo (TNodo *padre, TEndidad *ent,
vec3 traslación, vec3 escalado, vec3 rotación)
{
crear nodo y asociarle la entidad
añadir el nuevo nodo como hijo del nodo padre
almacenar traslación, escalado y rotación
actualizarMatriz = true
devolver la referencia al nodo creado
}

TCamara *TMotorTAG :: crearCamara (…) {
Crear cámara y devolverla
}
TLuz *TMotorTAG :: crearLuz (…) {
Crear luz y devolverla
}
TMalla *TMotorTAG :: crearMalla (char* fichero, …) {
Pedir el recurso malla al gestor de recursos a partir del fichero
Crear la malla a partir del recurso malla y devolverla
}
*/