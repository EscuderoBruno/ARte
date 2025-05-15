import { TEntidad } from './TEntidad';
import { mat4, vec3 } from 'gl-matrix';

export class TLuz extends TEntidad {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private ambient: number;
  private color: vec3;
  private intensity: number;
  private direction: vec3;

  constructor(gl: WebGLRenderingContext, program: WebGLProgram, color: vec3 , intensity: number, direction: vec3) {
    super();
    this.gl = gl;
    this.program = program;
    this.color = color;
    this.intensity = intensity;
    this.direction = direction;
    this.ambient = 0.2;
  }

  setAmbient(i: number) {
    this.ambient = i;
  }

  setColor(r: number, g: number, b: number) {
    this.color = [r, g, b];
  }

  setIntensity(intensity: number) {
    this.intensity = intensity;
  }

  setDirection(x: number, y: number, z: number) {
    this.direction = [x, y, z];
  }

  setupInShader(program: WebGLProgram) {
    const ambientLocation = this.gl.getUniformLocation(
      program,
      'ambientIntensity'
    );
    const colorLocation = this.gl.getUniformLocation(program, 'lightColor');
    const intensityLocation = this.gl.getUniformLocation(
      program,
      'lightIntensity'
    );
    const directionLocation = this.gl.getUniformLocation(
      program,
      'lightDirection'
    );

    this.gl.uniform1f(ambientLocation, this.ambient);
    this.gl.uniform3fv(colorLocation, new Float32Array(this.color));
    this.gl.uniform1f(intensityLocation, this.intensity);
    this.gl.uniform3fv(directionLocation, new Float32Array(this.direction));
  }

  public override dibujar(): void {
    this.setupInShader(this.program);
  }
}
