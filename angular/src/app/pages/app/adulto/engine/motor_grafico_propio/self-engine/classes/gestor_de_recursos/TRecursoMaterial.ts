import { TMalla } from './TMalla';
import {TRecurso} from './TRecurso';
import {vec2, vec3} from 'gl-matrix';


export class TRecursoMaterial extends TRecurso {
    private coeficiente_luz_difusa!: vec3; //$clr.diffuse (0.8 gris claro)
    private coeficiente_luz_especular!: vec3; //$clr.specular (1 blanco)
    private coeficiente_luz_ambiente!: vec3; //$clr.ambient (0 negro)

    public constructor(path: string) {
        //SÓLO SE PUEDE LLAMAR DESDE GESTOR DE RECURSOS
        super();
        this.setNombre(path);

        const jsonData = this.loadJsonFile(path);

        let vertices = jsonData.materials[0].properties[1].value;

        for (let i = 0; i < jsonData.materials[0].properties.length; i++) {
            if(jsonData.materials[0].properties[i].key === "$clr.diffuse") {
                let v = jsonData.materials[0].properties[i].value;

                let vector3 = vec3.create();
                vec3.set(vector3, v[0], v[1], v[2]);

                this.coeficiente_luz_difusa = vector3;
            }
            if(jsonData.materials[0].properties[i].key === "$clr.specular") {
                let v = jsonData.materials[0].properties[i].value;

                let vector3 = vec3.create();
                vec3.set(vector3, v[0], v[1], v[2]);

                this.coeficiente_luz_especular = vector3;
            }
            else if(jsonData.materials[0].properties[i].key === "$clr.ambient") {
                let v = jsonData.materials[0].properties[i].value;

                let vector3 = vec3.create();
                vec3.set(vector3, v[0], v[1], v[2]);

                this.coeficiente_luz_ambiente = vector3;
            }
        }

        //console.log(this.coeficiente_luz_ambiente);
        //console.log(this.coeficiente_luz_difusa);
        //console.log( this.coeficiente_luz_especular);
    }
}