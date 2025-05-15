import { TEntidad } from './TEntidad';
import { TRecursoModelo } from '../gestor_de_recursos/TRecursoModelo';
import { TGestorRecursos } from '../gestor_de_recursos/TGestorRecursos';
import { TRecursoMaterial } from '../gestor_de_recursos/TRecursoMaterial';
import { TRecursoTextura } from '../gestor_de_recursos/TRecursoTextura';

import { mat4 } from 'gl-matrix';


export class TModelo extends TEntidad {
  private modelo3D!: TRecursoModelo;
  private material!: TRecursoMaterial;
  private textura!: TRecursoTextura;

  public constructor(
    ruta_modelo: string,
    ruta_textura: string,
    ruta_material: string,
    gestor: TGestorRecursos,
    gl: WebGLRenderingContext | null,
    viewProjectionMatrix: mat4,
    programId: WebGLProgram | null,
  ) {
    super();

    this.modelo3D = gestor.getRecursoModelo(
      ruta_modelo,
      gl,
      viewProjectionMatrix,
      programId
    );
    
    this.material = gestor.getRecursoMaterial(ruta_material, gl, programId,);

    this.textura = gestor.getRecursoTextura(ruta_textura, gl, programId);
  }

  public override dibujar(): void {
    this.modelo3D.draw();
    this.textura.draw();
    this.material.draw();
  }
}
