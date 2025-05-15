import {TRecurso} from './TRecurso';
import {vec2, vec3} from 'gl-matrix';
import * as OBJ from 'webgl-obj-loader';


export class TRecursoMaterial extends TRecurso {
    private programId!: WebGLProgram;
    private gl!: WebGLRenderingContext;
    private path!: string;
    private estar_cardada: boolean;

    public constructor(path: string, gl: WebGLRenderingContext | null, programId: WebGLProgram | null) {
        //SÓLO SE PUEDE LLAMAR DESDE GESTOR DE RECURSOS
        super();
        this.setNombre(path);

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

        if (path != null) {
            this.path = path;
        } else {
            console.error('La ruta de la textura no se ha inicializado');
        }

        this.estar_cardada = false;
    }

        public draw(): void {
        if(!this.estar_cardada) {
            this.loadMateriales();
            this.estar_cardada = true;
        }
    }

    public loadMateriales(): void {
        let first_material = this.cargarPrimerMaterial();
    
        //console.log(first_material);
    
        //cargar el uniform
        this.pasarMaterialAlShader3Floats('uKa', first_material.ambient);
        this.pasarMaterialAlShader3Floats('uKd', first_material.diffuse);
        this.pasarMaterialAlShader3Floats('uKs', first_material.specular);
    
        this.pasarMaterialAlShader1Float('uNs', first_material.specularExponent);
      }
        
    
      private cargarPrimerMaterial(): any {
        const MTL_File = this.loadFile(this.path);
        let materialLibrary = new OBJ.MaterialLibrary(MTL_File);
    
        for (let materialName in materialLibrary.materials) {
          if (materialLibrary.materials.hasOwnProperty(materialName)) {
            let material = materialLibrary.materials[materialName];
            //console.log(`Material Loaded: ${materialName}`, material);
            return material;
          }
        }
      }
    
      private pasarMaterialAlShader3Floats(nombre_en_shader: string, valor: Float32List): void {
        let uniformLocation = this.gl.getUniformLocation(
          this.programId,
          nombre_en_shader
        );
    
        this.gl.uniform3fv(
          uniformLocation,
          valor
        );    
      }
    
      private pasarMaterialAlShader1Float(nombre_en_shader: string, valor: number): void {
        let uniformLocation = this.gl.getUniformLocation(
          this.programId,
          'uNs'
        );
    
        this.gl.uniform1f(
          uniformLocation,
          valor
        ); 
      }
}