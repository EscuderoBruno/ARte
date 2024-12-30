import {TEntidad} from './TEntidad';
import {mat4, vec3} from 'gl-matrix';

export class TLuz extends TEntidad {
    private intensidad!: vec3;

    public constructor(new_intensidad: vec3){
        super();
        this.intensidad = new_intensidad;
    };

    public setIntensidad(new_vec :vec3): void{
        this.intensidad = new_vec;
    };
    public getIntensidad(): vec3{
        return this.intensidad;
    };

    public override dibujar(): void{
        console.log("Luz: ",this.intensidad);
    };
}