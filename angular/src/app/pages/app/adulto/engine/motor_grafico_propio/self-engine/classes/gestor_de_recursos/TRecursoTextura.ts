import { TMalla } from './TMalla';
import {TRecurso} from './TRecurso';
import {vec2, vec3} from 'gl-matrix';


export class TRecursoTextura extends TRecurso {
    private id!: number; //(glGenTextures)
    private width!: number;
    private height!: number;

    public constructor(path: string) {
        //SÓLO SE PUEDE LLAMAR DESDE GESTOR DE RECURSOS
        super();
        this.setNombre(path);
    }
}