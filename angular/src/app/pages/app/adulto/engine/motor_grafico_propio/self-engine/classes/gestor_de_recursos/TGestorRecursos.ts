import { TRecurso } from "./TRecurso";
import { TRecursoModelo } from "./TRecursoModelo";
import { TRecursoMaterial } from "./TRecursoMaterial";
import { mat4 } from "gl-matrix";

export class TGestorRecursos {
    private modelos_guardados = new Map<string, TRecursoModelo>(); //https://www.tutorialspoint.com/how-to-use-hashmap-in-typescript
    private materiales_guardados = new Map<string, TRecursoMaterial>();

    /*public getRecurso(path :string): TRecurso{
        let recurso = this.recursos_en_memoria.get(path);
        if(recurso == undefined) {
            var new_recurso = new TRecurso();
            new_recurso.cargarFichero(path);
            this.recursos_en_memoria.set(path, new_recurso);
            return new_recurso;
        }
        return recurso;
    }*/

    public getRecursoModelo(path :string, gl: WebGLRenderingContext | null, viewProjectionMatrix: mat4, programId: WebGLProgram | null): TRecursoModelo{
        let new_recurso = this.modelos_guardados.get(path);
        if(new_recurso == undefined) {
            //console.log("No recurso: " + this.modelos_guardados.size + path);
            new_recurso = new TRecursoModelo(path, gl, viewProjectionMatrix, programId);
            this.modelos_guardados.set(path, new_recurso);
        } else {console.log("Cargando el recurso (sin duplicar memoria): " + path);}
        return new_recurso;
    }

    public getRecursoMaterial(path :string): TRecursoMaterial{
        let new_recurso = this.materiales_guardados.get(path);
        if(new_recurso == undefined) {
            new_recurso = new TRecursoMaterial(path);
            this.materiales_guardados.set(path, new_recurso);
        }
        return new_recurso;
    }
}