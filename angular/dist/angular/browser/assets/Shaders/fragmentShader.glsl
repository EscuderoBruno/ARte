precision highp float;

varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform float ambientIntensity;
uniform vec3 lightColor;
uniform float lightIntensity;
uniform vec3 lightDirection;

uniform vec3 uKa; // Reflectividad ambiente
uniform vec3 uKd; // Reflectividad difusa
uniform vec3 uKs; // Reflectividad especular
uniform float uNs; // Exponente especular

varying highp vec3 vNormalCoord;

void main() {
    // LUZ AMBIENTAL
    vec3 ambient = uKa * ambientIntensity;

    //LUZ DIFUSA
    // Calcula la intensidad de la luz difusa
    float diffuseIntensity = max(dot(normalize(lightDirection), -normalize(vNormalCoord)), 0.0);
    vec3 diffuseColor = uKd * lightColor * diffuseIntensity;

    //LUZ ESPECULAR
    vec3 viewDir = normalize(-gl_FragCoord.xyz); // Suponiendo que la cámara está en el origen
    vec3 reflectDir = reflect(-lightDirection, normalize(vNormalCoord));
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uNs);
    vec3 specular = uKs * spec * lightIntensity;

    // CALCULO DE LA LUZ
    vec3 finalColor = ( diffuseColor + ambient + specular);

    gl_FragColor = vec4(finalColor, 1.0) * texture2D(uSampler, vTextureCoord);
}




/*
precision mediump float;

void main() {
    float depth = gl_FragCoord.z; // Obtener la coordenada de profundidad
    float contrast = 3.0; // Ajusta este valor para controlar el contraste
    depth = pow(depth, contrast); // Aplicar una función de potencia para aumentar el contraste
    gl_FragColor = vec4(vec3(depth), 1.0); // Asignar el valor de profundidad al color del fragmento
}
*/
