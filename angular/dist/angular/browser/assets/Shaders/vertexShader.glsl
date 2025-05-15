// Vertex attributes

precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aNormalCoord;
attribute vec2 aTextureCoord;
//attribute vec3 faces;

// Uniforms
uniform mat4 uModelMatrix;
uniform mat4 uProjectionViewMatrix;

//varying (fragment)
varying highp vec2 vTextureCoord;

varying highp vec3 vNormalCoord;

void main() {
    // Transformar la posición del vértice usando la matriz MVP
    gl_Position = uProjectionViewMatrix * uModelMatrix * vec4(aVertexPosition, 1);
    vTextureCoord = aTextureCoord;
    vNormalCoord = mat3(uModelMatrix) * aNormalCoord;
}
