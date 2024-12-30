import {TEntidad} from './TEntidad';
//import {perspective} from './webGL/perspective';
import { mat4 } from 'gl-matrix';

export class TCamara extends TEntidad {
    private esPerspectiva!: boolean;
    private cercano!: number; 
    private lejano!: number; 

    private anguloVisión!: number;
    private aspecto!: number;

    private projectionMatrix!: mat4;
    private viewMatrix!: mat4;
    private viewProjectionMatrix!: mat4;
  
    public constructor(serPerspectiva: boolean, cercano: number, lejano: number, aspecto: number, anguloVisión: number){
      super();
      this.esPerspectiva = serPerspectiva;
      this.cercano = cercano;
      this.lejano = lejano;
      this.aspecto = aspecto;
      this.anguloVisión = anguloVisión;

      if(this.esPerspectiva) {
        this.setPerspectiva();
      }
    };   
    
    public setPerspectiva(): void { //fovy: [0,pi]  aspect [0.3, 1.7 aprox] 1 es cuadrada
      this.projectionMatrix = mat4.create();
      this.viewMatrix = mat4.create();
      this.viewProjectionMatrix = mat4.create();

      mat4.perspective(this.projectionMatrix, this.anguloVisión, this.aspecto, this.cercano, this.lejano);
      mat4.invert(this.viewMatrix, this.projectionMatrix);
      mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
    }

    public setParalela(n: number, n2: number): void{ //orth 
      
    }

    public getViewProjectionMatrix(): mat4 { 
      return this.viewProjectionMatrix;
    }

    public override dibujar(): void{ //NO DEBE TENER NADA NI CAMARA NI LUZ
      //console.log("Camara: ", this.esPerspectiva, this.cercano, this.lejano);
      //gl.drawCamera();

      //glmatrix perspective = hace q pasen los puntos del espacio de la escena para dibujar en el canvas en 2D
      //y la de vista es la inversa 
    };

    
  }