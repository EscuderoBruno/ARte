/*
___________________
CLASE
TNodo
___________________
ATRIBUTOS
TEntidad *entidad
vector <TNodo*> hijos
TNodo *padre
vec3 traslacion
vec3 rotacion
vec3 escalado
mat4 matrizTransf
actualizar_matriz: boolean;
engine TMotor
___________________
FUNCIONES
int addHijo (TNodo *)
int remHijo (TNodo *)
bool setEntidad (TEntidad *)
TEntidad *getEntidad ()
TNodo *getPadre ()
TNodo setPadre()
setPadreNull()
void recorrer (mat4)
setTraslacion (vec3)
setRotacion (vec3)
setEscalado (vec3)
trasladar (vec3)
rotar (vec3)
escalar (vec3)
vec3 getTraslacion ()
vec3 getRotacion ()
vec3 getEscalado ()
setMatrizTransf (mat4)
mat4 getMatrizTransf ()
mat4 calcularRotacion()
setPadre()
setActualizarMatriz()
setEngine()
print_mat4()
*/

import { mat4, vec3 } from 'gl-matrix';
//import {TEntidad} from '../self_engine.service';
import { TEntidad } from './TEntidad';
import { TCamara } from './TCamara';
import { MotorTag } from '../interfaz/MotorTag';
import { TModelo } from './TModelo';

export class TNodo {
  //atributos del nodo
  private entidad!: TEntidad;
  private hijos!: TNodo[];
  private padre!: TNodo | undefined;

  private traslacion!: vec3;
  private rotacion!: vec3;
  private escalado!: vec3;

  private matrizTransf!: mat4;

  private actualizar_matriz!: boolean;

  private engine!: MotorTag;

  //funciones del nodo
  public constructor() {
    this.hijos = [];

    this.traslacion = vec3.create();
    this.rotacion = vec3.create();
    this.escalado = vec3.create();
    vec3.set(this.escalado, 1, 1, 1);

    this.matrizTransf = mat4.create();

    this.actualizar_matriz = false;
  }

  public addHijo(nodo_hijo: TNodo): number {
    this.hijos.push(nodo_hijo);
    nodo_hijo.setPadre(this);
    return this.hijos.length; //DUDA: ¿DEBE DEVOLVER OTRA COSA?
  }

  public remHijo(nodo_hijo_a_eliminar: TNodo): number {
    let nueva_lista_hijos = new Array(this.hijos.length);
    let indice_nodo_eliminar = this.hijos.indexOf(nodo_hijo_a_eliminar);

    for (var i = 0; i < this.hijos.length; ++i) {
      if (indice_nodo_eliminar != i) {
        nueva_lista_hijos.push(this.hijos[i]);
      }
    }

    this.hijos = nueva_lista_hijos;

    nodo_hijo_a_eliminar.setPadreNull();

    return this.hijos.length;
  }

  public setEntidad(entidad_del_nodo: TEntidad): boolean {
    if (this.entidad != undefined) {
      console.log('Warning: Estás cambiando la entidad');
    }
    this.entidad = entidad_del_nodo;
    return true;
  }

  public getEntidad(): TEntidad {
    return this.entidad;
  }

  public getPadre(): TNodo | undefined {
    if (this.padre != undefined) return this.padre;
    else return undefined;
  }

  public setPadre(nodo_padre: TNodo): void {
    this.padre = nodo_padre;
  }

  public setPadreNull() {
    this.padre = undefined;
  }

  public getMatrizTransf(): mat4 {
    return this.matrizTransf;
  }

  public recorrer(
    matriz_acumulada: mat4,
    actualizar_matriz_forzado_por_padre: boolean
  ): void {
    if (this.actualizar_matriz || actualizar_matriz_forzado_por_padre) {
      mat4.multiply(this.matrizTransf, matriz_acumulada, this.calcularMatriz());
      this.actualizar_matriz = false;
      actualizar_matriz_forzado_por_padre = true;
    }
    if (this.entidad) {
      const gl = this.engine.getGl();
      const programId = this.engine.getProgram();
      if (gl && programId) {
        if (this.entidad instanceof TCamara) {
          this.entidad.setViewMatrix(this.getTraslacion());
          /*
          var transformationMatrixLocation = gl.getUniformLocation(
            programId,
            'uProjectionViewMatrix'
          );

          gl.uniformMatrix4fv(
            transformationMatrixLocation,
            false,
            this.entidad.getProjectionMatrix()
          );
          */
        } else {
          //son modelos o luces
          var transformationMatrixLocation = gl.getUniformLocation(
            programId,
            'uModelMatrix'
          );
          if (this.entidad instanceof TModelo) {
            gl.uniformMatrix4fv(
              transformationMatrixLocation,
              false,
              this.matrizTransf
            );
          }
        }
      }
      this.entidad.dibujar();
    }
    if (this.hijos) {
      for (let i in this.hijos) {
        this.hijos[i].recorrer(
          this.matrizTransf,
          actualizar_matriz_forzado_por_padre
        );
      }
    } else {
      console.log('No tiene hijos');
    }
  }

  public calcularMatriz(): mat4 {
    var matrizAux = mat4.create(), // Crear una nueva matriz utilizando la función create() de gl-matrix
      matriz_trasladada = mat4.create(),
      matriz_escalada = mat4.create(),
      matriz_rotada_XYZ = mat4.create();

    mat4.fromTranslation(matriz_trasladada, this.traslacion); //Nos la da en la ultima fila en vez de columna
    //mat4.transpose(matriz_trasladada, matriz_trasladada);

    matriz_rotada_XYZ = this.calcularRotacion();

    mat4.fromScaling(matriz_escalada, this.escalado);

    mat4.multiply(matrizAux, matriz_trasladada, matriz_rotada_XYZ);
    mat4.multiply(matrizAux, matrizAux, matriz_escalada);
    return matrizAux;
  }

  public calcularRotacion(): mat4 {
    var matriz_rotada_X = mat4.create(),
      matriz_rotada_Y = mat4.create(),
      matriz_rotada_Z = mat4.create(),
      matriz_rotada_XYZ = mat4.create();

    mat4.fromRotation(matriz_rotada_X, this.rotacion[0], [1, 0, 0]);
    mat4.fromRotation(matriz_rotada_Y, this.rotacion[1], [0, 1, 0]);
    mat4.fromRotation(matriz_rotada_Z, this.rotacion[2], [0, 0, 1]);

    mat4.multiply(matriz_rotada_XYZ, matriz_rotada_XYZ, matriz_rotada_X);
    mat4.multiply(matriz_rotada_XYZ, matriz_rotada_XYZ, matriz_rotada_Y);
    mat4.multiply(matriz_rotada_XYZ, matriz_rotada_XYZ, matriz_rotada_Z);

    return matriz_rotada_XYZ;
  }

  public setTraslacion(vec_traslacion: vec3): void {
    this.traslacion = vec_traslacion;
    this.actualizar_matriz = true;
  }

  public setEscalado(vec_escalado: vec3): void {
    //console.log("vec: " + vec3.str(vec_traslacion));
    this.escalado = vec_escalado;
    this.actualizar_matriz = true;
  }

  public setRotacion(vec_rotacion: vec3): void {
    this.rotacion = vec_rotacion;
    this.actualizar_matriz = true;
  }

  public trasladar(vec_nuevaTraslacion: vec3): void {
    vec3.add(this.traslacion, this.traslacion, vec_nuevaTraslacion);
    this.actualizar_matriz = true;
  }

  public rotar(vec_nuevaRotacion: vec3): void {
    vec3.add(this.rotacion, this.rotacion, vec_nuevaRotacion);
    this.actualizar_matriz = true;
  }

  public escalar(vec_nuevoEscalar: vec3): void {
    vec3.multiply(this.escalado, this.escalado, vec_nuevoEscalar);
    this.actualizar_matriz = true;
  }

  public getTraslacion(): vec3 {
    return this.traslacion;
  }
  public getRotacion(): vec3 {
    return this.rotacion;
  }
  public getEscalado(): vec3 {
    return this.escalado;
  }

  public setMatrizTransf(new_matriz_transformacion: mat4): void {
    this.matrizTransf = new_matriz_transformacion;
  }

  public setActualizarMatriz(actualizar: boolean): void {
    this.actualizar_matriz = actualizar;
  }

  public setEngine(motor: MotorTag): void {
    this.engine = motor;
  }

  public print_mat4(): void {
    var a = this.matrizTransf;
    console.log(
      ' |' +
        a[0] +
        ', ' +
        a[4] +
        ', ' +
        a[8] +
        ', ' +
        a[12] +
        ' |\n |' +
        a[1] +
        ', ' +
        a[5] +
        ', ' +
        a[9] +
        ', ' +
        a[13] +
        ' |\n |' +
        a[2] +
        ', ' +
        a[6] +
        ', ' +
        a[10] +
        ', ' +
        a[14] +
        ' |\n |' +
        a[3] +
        ', ' +
        a[7] +
        ', ' +
        a[11] +
        ', ' +
        a[15] +
        ' |'
    );
  }
}
