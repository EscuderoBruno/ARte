import { TMalla } from './TMalla';
import {TRecurso} from './TRecurso';
import {vec2, vec3} from 'gl-matrix';
import { mat4 } from 'gl-matrix';

//import { TShader } from './TShader';


export class TRecursoModelo extends TRecurso {
    private mallas: TMalla[] = [];
    //private shader !: TShader;

    public constructor(path: string, gl: WebGLRenderingContext | null, viewProjectionMatrix: mat4, programId: WebGLProgram | null) {
        //SÓLO SE PUEDE LLAMAR DESDE GESTOR DE RECURSOS
        super();
        this.setNombre(path);

        //let new_shader = new TShader("shader1");

        const jsonData = this.loadJsonFile(path);

        const numero_modelos = jsonData.meshes.length;

        let vertices, normales, texturas;
        let new_malla;

        let modelMatrix  = mat4.create();
        let mvp = mat4.create();

        
        if (gl!=null && programId != null) {
            let matrixLocation = gl.getUniformLocation(programId, "mvp");
            
            //const location = gl.getUniformLocation(WebGLProgram, "mvp");
            
            for(let m = 0; m < numero_modelos; m++) {
                vertices = jsonData.meshes[m].vertices;
                normales = jsonData.meshes[m].normals;
                texturas = jsonData.meshes[m].texturecoords[0];

                //modelMatrix = jsonData.meshes[m].transformation;
                //console.log(modelMatrix);
                
                mvp = mat4.multiply(mvp, modelMatrix, viewProjectionMatrix);
                //console.log(mvp);
                //console.log(programId);
                gl.uniformMatrix4fv(matrixLocation, false, mvp)

                for (let i = 0; i < vertices.length/3; i++) {

                    //CAMBIAR EL PASO DE GL A MALLA
                    new_malla = this.loadMalla(i, vertices, normales, texturas, gl, programId);
                    this.mallas.push(new_malla);
                }
            }
        }

        //this.lecturaShader();
    }

    private asignarVec3(v1: number, v2: number, v3: number): vec3 { 
        let vector3 = vec3.create();
        vec3.set(vector3, v1, v2, v3);
        return vector3;
    }

    private asignarVec2(v1: number, v2: number): vec2 { 
        let vector2 = vec2.create();
        vec2.set(vector2, v1, v2);
        return vector2;
    }
    /*
    public lecturaShader(): void{
        this.shader.contexto();
        this.shader.createShaders();
    }
    */

    private loadMalla(i: any, vertices: any, normales: any, texturas: any, gl: WebGLRenderingContext | null, programId: WebGLProgram | null ): TMalla {
        let vec3_vertices, vec3_normales, vec2_texturas;
        let index, index_texture;
        let v1, v2, v3;
        let n1, n2, n3;
        let t1, t2;

        index = i*3;
        index_texture = i*2;

        //asignamos los valores para los 3 vertices, 3 normales y 2 coordenadas de texturas
        v1 = vertices[index], v2 = vertices[index + 1], v3 = vertices[index + 2];
        n1 = normales[index], n2 = normales[index + 1], n3 = normales[index + 2];
        t1 = texturas[index_texture], t2 = texturas[index_texture + 1];

        //asigna a vec3 los valores anteriores
        vec3_vertices = this.asignarVec3(v1,v2,v3);
        vec3_normales = this.asignarVec3(n1,n2,n3);
        vec2_texturas = this.asignarVec2(t1,t2);

        //Crea una malla (triangulo) con estos valores
        let new_malla = new TMalla(vec3_vertices, vec3_normales, vec2_texturas, gl, programId);

        return new_malla;
    }      

    public draw(): void {
        for(const i in this.mallas) {
            //this.mallas[i].draw();
        }
    }
}
