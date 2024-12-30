/*export class TShader {  
    protected gl: WebGLRenderingContext | null;
    private canvasId: string; // Elimina el operador opcional (!)

    constructor(canvasId: string) {
        this.canvasId = canvasId; // Inicializa canvasId con el valor proporcionado
        this.gl = null;
    }

    public contexto(): void {
        console.log("ENTRAAAAAAAAAAAAAAAAAAAAAAAAAA");

        const canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
        this.gl = canvas.getContext('webgl');
        if (!this.gl) {
            console.error('WebGL no está disponible en este navegador.');
        }
    }

    public createShaders(): void {
        if (!this.gl) {
            console.error('No se puede crear shaders sin un contexto WebGL.');
            return;
        }
        let vShaderId: WebGLShader | null = this.gl.createShader(this.gl.VERTEX_SHADER);
        // Lógica creación shaders
    }
}


// Uso:
//const shader = new TShader("shader1");
if(this !== undefined) {
    this.contexto(); // Establecer el contexto WebGL
    this.createShaders(); // Crear los shaders
}

*/

    


    
    /*
    public createShaders(): void{
        let vShaderId: WebGLShader | null = gl.createShader(gl.VERTEX_SHADER);
    }

    public setShaders(): void {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const gl = WebGLRenderingContext | null = canvas.getCont  ext('webgl');

        if (!gl) {
            console.error('WebGL no está disponible en este navegador.');
        } else {
            console.log("No funciona aquí");
        }
    }
    */

// crear recurso shader (nuevo) que crea el programa con vertex y fragment 

//debe salir en el canvas con el draw de malla 
