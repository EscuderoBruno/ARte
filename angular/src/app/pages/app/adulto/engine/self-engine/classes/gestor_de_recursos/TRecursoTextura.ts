
import {TRecurso} from './TRecurso';
import {vec2, vec3} from 'gl-matrix';


export class TRecursoTextura extends TRecurso {
    private programId!: WebGLProgram;
    private gl!: WebGLRenderingContext;
    private path!: string;
    private estar_cardada!: boolean;

    public constructor(
        path: string,
        gl: WebGLRenderingContext | null,
        programId: WebGLProgram | null
      ) {
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
            this.loadTexturas();
            this.estar_cardada = true;
        }
    }

    public loadTexturas(): void {
        const image = new Image();
        const gl = this.gl;
        const programId = this.programId;

        image.onload = () => {
            let resizedCanvas = this.resizeImageToPowerOfTwo(image);

            const texture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                resizedCanvas
            );

            if (
                (image.width & (image.width - 1)) === 0 &&
                (image.height & (image.height - 1)) === 0
            ) {
                // Solo funciona si es potencia de dos
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                // se ajusta la imagen (por no ser potencia de dos)

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }

            const samplerUniform = gl.getUniformLocation(programId, 'uSampler');
            gl.uniform1i(samplerUniform, 0); 
        };

        image.src = this.path;
    }

    private resizeImageToPowerOfTwo(img: any) {
        // Crea un elemento canvas
        var canvas = document.createElement('canvas');
        
        // Calcula la potencia de dos para las dimensiones de la imagen
        canvas.width = this.nextPowerOfTwo(img.width);
        canvas.height = this.nextPowerOfTwo(img.height);

        // Dibuja la imagen original en el canvas redimensionado
        var ctx = canvas.getContext('2d');
        
        if(ctx)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        return canvas;
    }

    //calcula la potencia de dos más cercana
    private nextPowerOfTwo(value: any) {
        return Math.pow(2, Math.ceil(Math.log(value) / Math.log(2)));
    }
}