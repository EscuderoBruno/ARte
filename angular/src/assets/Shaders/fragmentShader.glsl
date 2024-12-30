//out vec4 fragColor; // valor de salida (color del fragmento)
/*
struct Material {
    sampler2D diffuseTexture;
    // TODO: añadir specularTexture y resto de propiedades del material
};

in vec2 texCoord; // Recibido desde el vertex shader
uniform Material material; */

void main() {
    //fragColor = texture(material.diffuseTexture, texCoord);
    gl_FragColor = vec4(1.0, 0.5, 0.2, 1.0); //highp 
}