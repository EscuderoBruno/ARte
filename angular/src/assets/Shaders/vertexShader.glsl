// Vertex attributes
attribute vec3 aPos;

void main() {
    gl_Position = vec4(aPos, 1.0);
}

//layout (location = 0) in vec3 aPos; // posición del vértice 
/* //getPosition
layout (location = 1) in vec3 aNormal; // normal del vértice
layout (location = 2) in vec2 aTexCoord; // coordenada de textura

//out vec2 texCoord; // salida para enviar datos al fragment shader
uniform (location = 4) mat4 mvp; // uniform con la multiplicación projection*view*model

void main() {
    //gl_Positionvec4(1,1,1,1);
    gl_Position = mvp * vec4(aPos, 1.0f);
    //texCoord = aTexCoord;
}
*/