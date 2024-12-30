import {TRecurso} from '../gestor_de_recursos/TRecurso';
//import {vec2, vec3} from 'gl-matrix';
import { ElementRef, Injectable, NgZone, OnDestroy, Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';


@Injectable({
    providedIn: 'root'
})

export class TRecursoShader extends TRecurso { //implements AfterViewInit
    private canvas!: HTMLCanvasElement;
    protected gl!: WebGLRenderingContext | null;

    public constructor(canvas: HTMLCanvasElement) {             
        super();
        
        //this.ngAfterViewInit();
        
        //const resetButton = document.getElementById('resetButton');

        // Para probar: console.log(canvas);
        

        this.checkInitCanvas(canvas);
        this.checkInitGl(canvas);

        this.canvas.innerHTML = 'wuola'; 
        this.canvas.style.backgroundColor = 'rgba(0,0,0,1)';
    }

    private checkInitCanvas(canvas: HTMLCanvasElement): void {
        const pruebaCanvas = canvas;
        if (!pruebaCanvas) {
            throw new Error(`No se encontró el elemento canvas con el ID: ${canvas}`);
        } else { /*console.log("canvas inicializado correctamente");*/}

        this.canvas = canvas;
    }

    private checkInitGl(canvas: HTMLCanvasElement): void {
        const pruebaGl = canvas.getContext('webgl');
        if (!pruebaGl) {
            throw new Error('WebGL no está disponible en este navegador.');
        } else {/*console.log("gl inicializado correctamente");*/}

        this.gl = canvas.getContext('webgl');
    }

    //ngAfterViewInit() {}

    public setShaders(): WebGLProgram | null {
        if(this.gl != null) {
            let vShaderId: WebGLShader | null;
            let fShaderId: WebGLShader | null;
            let programId: WebGLProgram | null;
            let vShaderCode: string | null;
            let fShaderCode: string | null;
            
        
            // CREAR LOS SHADERS
            vShaderId = this.gl.createShader(this.gl.VERTEX_SHADER);
            fShaderId = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        
            // LEER LOS FICHEROS Y DEFINIRLOS COMO FUENTES
            vShaderCode = this.loadFile("/assets/Shaders/vertexShader.glsl");
            fShaderCode = this.loadFile("/assets/Shaders/fragmentShader.glsl");

            //console.log("Shader: " + vShaderCode);
        
            if (vShaderId && fShaderId && vShaderCode && fShaderCode) {
                this.gl.shaderSource(vShaderId, vShaderCode);
                this.gl.shaderSource(fShaderId, fShaderCode);
        
                // COMPILAR LOS SHADERS
                this.gl.compileShader(vShaderId);
                this.gl.compileShader(fShaderId);
                
                //COMPROBAR ERRORES COMPILACION
                this.checkShadersError(vShaderId);    
                this.checkShadersError(fShaderId);
                
        
                // CREAR PROGRAMA, ASOCIAR SHADERS Y ENLAZARLO TODO
                programId = this.gl.createProgram();
                if (programId) {
                    //this.gl.bindAttribLocation(programId, 0, "aPos");
                    this.gl.attachShader(programId, fShaderId);
                    this.gl.attachShader(programId, vShaderId);
                    this.gl.linkProgram(programId);

                    //COMRPOBAR ERRORES COMPILACIÓN
                    const success = this.gl.getProgramParameter(programId, this.gl.LINK_STATUS);
                    if (!success) {
                        const infoLog = this.gl.getProgramInfoLog(programId);
                        //this.gl.glGetProgramiv(programId, this.gl.GL_COMPILE_STATUS, success);
                        console.error('Error linking shader program:', infoLog);
                    }
                }

                // BORRAMOS LOS SHADERS UNA VEZ CREADO EL PROGRAMA
                this.gl.deleteShader(vShaderId);
                this.gl.deleteShader(fShaderId);
        
                // AHORA SE PUEDE USAR EN CUALQUIER MOMENTO
                this.gl.useProgram(programId);

                return programId;
        
                // Otros pasos para compilar y vincular shaders
            } else {
                console.error("No se pudieron crear los shaders o leer los archivos.");
            }
        } else {
            console.error("No se ha inicializado TRecursoShader");
        }
        return null;
    }

    private checkShadersError(shader: WebGLShader | null): void {
        //COMPROBAR ERRORES COMPILACION
        if(this.gl && shader){
            var compiled = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
            if(compiled == false){
                //console.log('Shader compiled successfully: ' + compiled);
                var compilationLog = this.gl.getShaderInfoLog(shader);
                console.log('Shader compiler log: ' + compilationLog);
            }
        }
        
    }
    
    // Aquí estaría disponible el contexto WebGL (gl) y podrías llamar a la función setShaders() cuando lo necesites
    
}