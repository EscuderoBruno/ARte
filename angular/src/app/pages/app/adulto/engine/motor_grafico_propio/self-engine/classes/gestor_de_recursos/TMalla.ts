import {vec2, vec3} from 'gl-matrix';
import { PositionalAudio } from 'three';

export class TMalla {
    private vertices!: vec3;
    private normales!: vec3;
    private coordenadas_textura!: vec2;

    private verticesGuardados!: Float32Array;
    private buffer!: WebGLBuffer;
    //private caras!: vec3;
    private gl!:WebGLRenderingContext | null;

    public constructor(vertices: vec3, normales: vec3, coordenadas_textura: vec2, gl: WebGLRenderingContext | null, programId: WebGLProgram | null) {
        this.vertices = vertices;
        this.normales = normales;
        this.coordenadas_textura = coordenadas_textura;

        console.log("PRUEBAAAAAA" + gl);


    //DIAPOSITIVAS
        if(gl != null) {
            this.gl = gl;
            const vaoExt = gl.getExtension('OES_vertex_array_object');
            if(!vaoExt){
                console.log('OES_vertex_array_object extension is not supported');
            }
            else{
                const vao = vaoExt.createVertexArrayOES();
                if(!vao) {
                    console.log("Error creating vertex array object");
                }
                else{
                    vaoExt.bindVertexArrayOES(vao);
                }
            }

            if(gl != null && programId){
                let buffers: WebGLBuffer[] = [];
                buffers[0] = gl.createBuffer()!;
                gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0]);

                //CAMBIAR BORRAR ELIMINAR
                let vertices_prueba =  [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices_prueba), gl.STATIC_DRAW);


                //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
                gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * Float32Array. BYTES_PER_ELEMENT, 0);
                gl.enableVertexAttribArray(0);
                //gl.bindAttribLocation(programId, 0, "aPos");


                buffers[1] = gl.createBuffer()!;
                gl.bindBuffer(gl.ARRAY_BUFFER, buffers[1]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normales), gl.STATIC_DRAW);
                gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
                gl.enableVertexAttribArray(1);

                buffers[2] = gl.createBuffer()!;
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers[2]);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.coordenadas_textura), gl.STATIC_DRAW);
            }
        }
    }

    public draw(): void {
        let string = 'vertices: ' + vec3.str(this.vertices) 
                   + ' normales: ' + vec3.str(this.normales)
                   + ' coordenadas_textura: ' + vec2.str(this.coordenadas_textura);
        console.log(string);

        if(this.gl != null){

            const vaoExt = this.gl.getExtension('OES_vertex_array_object');
            if(!vaoExt){
                console.log('OES_vertex_array_object extension is not supported');
            }
            else{
                const vao = vaoExt.createVertexArrayOES();
                if(!vao) {
                    console.log('Error creating vertex array object');
                }
                else{
                    vaoExt.bindVertexArrayOES(vao);
                }
            }
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4); //CAMBIAR BORRAR ELIMINAR
            //this.gl.drawElements(this.gl.TRIANGLES, this.coordenadas_textura.length, this.gl.UNSIGNED_INT, 0);
        }
        

        
    

  
  
  /*positionBuffer = [0, 0, 0, 0]
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
  this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0);
  this.gl.enableVertexAttribArray(positionLocation);
  this.gl.attachShader(programId, fShaderId);
  this.gl.attachShader(programId, vShaderId);
  this.gl.linkProgram(programId);
*/
    }
}