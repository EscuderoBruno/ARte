import { TRecurso } from './TRecurso';
import { vec2, vec3, mat4 } from 'gl-matrix';
import * as OBJ from 'webgl-obj-loader';

export class TRecursoModelo extends TRecurso {
  private programId!: WebGLProgram;
  private gl!: WebGLRenderingContext;
  private mesh!: any;

  public constructor(
    path: string,
    gl: WebGLRenderingContext | null,
    viewProjectionMatrix: mat4,
    programId: WebGLProgram | null,
  ) {
    //SÓLO SE PUEDE LLAMAR DESDE GESTOR DE RECURSOS
    super();
    this.setNombre(path); //Nombre que se le asigna como TRecurso (atributo de la superclase)

    if (programId != null) {
      this.programId = programId;
    } else {
      console.error('ProgramId no se ha inicializado');
    }

    if (gl != null) {
      this.gl = gl;
    } else {
      console.error('gl no se ha inicializado');
    }

    //Obtenemos la malla del archivo OBJ
    const OBJ_File = this.loadFile(path);
    this.mesh = new OBJ.Mesh(OBJ_File);

    //Se inicializar buffers con funcion de OBJ
    OBJ.initMeshBuffers(this.gl, this.mesh);

    //Dibuja la malla
    this.draw();
  }

  public draw(): void {
    //Obtenemos los datos de la malla
    const vertices = this.mesh.vertices;
    const normales = this.mesh.vertexNormals;
    const textura = this.mesh.textures;

    const vertices_tamaño = this.mesh.vertexBuffer.itemSize;
    const normales_tamaño = this.mesh.normalBuffer.itemSize;
    const textura_tamaño = this.mesh.textureBuffer.itemSize;

    //Cargamos los buffers en memoria
    this.cargarBufferEnShader(vertices, 'aVertexPosition', vertices_tamaño);
    this.cargarBufferEnShader(normales, 'aNormalCoord', normales_tamaño);
    this.cargarBufferEnShader(textura, 'aTextureCoord', textura_tamaño);

    //Limpiamos canvas y activamos profundidad
    //this.gl.clearColor(0.922, 0.722, 0.451, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);

    //Dibujamos mallas
    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.mesh.indexBuffer.numItems,
      this.gl.UNSIGNED_SHORT,
      0
    );
  }

  public cargarBufferEnShader(
    datos: any,
    variableShader: string,
    size: number
  ): void {

    //Crear buffer
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(datos),
      this.gl.STATIC_DRAW
    );

    // Vincular el buffer
    const position = this.gl.getAttribLocation(this.programId, variableShader);
    this.gl.enableVertexAttribArray(position);
    this.gl.vertexAttribPointer(position, size, this.gl.FLOAT, false, 0, 0);
  }

  
}
