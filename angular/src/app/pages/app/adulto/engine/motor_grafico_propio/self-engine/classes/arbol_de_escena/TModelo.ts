import {TEntidad} from './TEntidad';
import {TRecursoModelo} from '../gestor_de_recursos/TRecursoModelo';
import { TGestorRecursos } from '../gestor_de_recursos/TGestorRecursos';
import { TRecursoMaterial } from '../gestor_de_recursos/TRecursoMaterial';
import { TRecurso } from '../gestor_de_recursos/TRecurso';
import { mat4 } from 'gl-matrix';

export class TModelo extends TEntidad {
    private modelo3D!: TRecursoModelo; 
    private material!: TRecursoMaterial; 

    public constructor(path: string, gestor: TGestorRecursos, gl: WebGLRenderingContext | null, viewProjectionMatrix: mat4, programId: WebGLProgram | null){
        super();
        //var modelo = new TRecursoModelo(path); 
        //
        //this.modelo3D = modelo;
        this.modelo3D = gestor.getRecursoModelo(path, gl, viewProjectionMatrix, programId);
        this.material = gestor.getRecursoMaterial(path);
    }

    //private TRecursoModelo!: TRecursoModelo;
    //Trecuro modelo tiene un array de mallas y hereda de recursos >(q tiene pazth)
  
    //public cargarRecursoModelo( :TFichero): void{}; //llama al gestor de recursos
    //el gestor de recursos es el que trabaja con las mallas

    //Gestor de recursos solo guarda un HashMap de recursos. Se puede poner un array para cada cosa.

    //public override dibujar( :mat4): void{
        //llamar al dibujar de cada malla
    //};
    public override dibujar(): void{
        this.modelo3D.draw();
    };
}