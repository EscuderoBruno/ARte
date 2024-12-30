import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from '../../../../commons/admin/breadcrumb/breadcrumb.service';
import { Location } from '@angular/common';
import { Exposicion, ExposicionService } from '../exposicion-service.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AlertService } from '../../../../services/alert.service';
import { Estado, EstadosService } from '../../../../services/estados.service';

@Component({
  selector: 'app-crear-exposicion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-exposicion.component.html',
  styleUrl: './crear-exposicion.component.css'
})

export class CrearExposicionComponent {
  
  newImage = "../../../../assets/images/piezas/defualt_image.png";

  nuevaExposicion = new FormGroup({
    nombre: new FormControl<string>('', [Validators.required]),
    autores: new FormControl<string>(''),
    descripcion: new FormControl<string>(''),
    estado_id: new FormControl<string>('0', this.noZeroValidator()),
    fecha_inicio: new FormControl<string>(''),
    fecha_fin: new FormControl<string>(''),
  });

  formularioEnviado = false;

  estadosPosibles: Estado[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private location: Location,
    private exposicionService: ExposicionService,
    private router: Router,
    private alertService: AlertService,
    private estadoService: EstadosService
  ) {}

  ngOnInit(): void {
    this.formularioEnviado = false;
    this.estadoService.getAllEstados().subscribe(data => {
      this.estadosPosibles = data;
    })
    this.nuevaExposicion.controls['fecha_inicio'].setValue(new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).split('/').reverse().join('-'))
    // Actualizar el título de la página dinámicamente
    this.breadcrumbService.updateBreadcrumb('Crear exposición', ['Inicio', 'Exposiciones', 'Crear']);
  }

  get nombre() {
    return this.nuevaExposicion.controls['nombre']
  }

  get estado() {
    return this.nuevaExposicion.controls['estado_id']
  }

  noZeroValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value === '0') {
        return { 'noZero': { value: value } };
      }
      return null;
    };
  }

  crearExposicion(event: any){
    event.preventDefault();
    this.formularioEnviado = true;
    if(!this.nuevaExposicion.valid){ return; }
    const formData = new FormData(event.target);
    console.log(formData.get('imagen'));
    if(this.nuevaExposicion.value.nombre){
      formData.append('nombre', this.nuevaExposicion.value.nombre);
    }
    if(this.nuevaExposicion.value.autores){
      formData.append('autores', this.nuevaExposicion.value.autores);
    }
    if(this.nuevaExposicion.value.descripcion){
      formData.append('descripcion', this.nuevaExposicion.value.descripcion);
    }
    if(this.nuevaExposicion.value.estado_id){
      formData.append('estado_id', this.nuevaExposicion.value.estado_id);
    }
    if(this.nuevaExposicion.value.fecha_inicio){
      formData.append('fecha_inicio', this.nuevaExposicion.value.fecha_inicio);
    }
    if(this.nuevaExposicion.value.fecha_fin){
      formData.append('fecha_fin', this.nuevaExposicion.value.fecha_fin);
    }
    this.exposicionService.createNew(formData).subscribe((data: Exposicion) => {
      console.log(data);
      this.router.navigate(['/administrador/exposiciones']);
      this.alertService.showAlertExposiciones(true);
    });
  }

  // Cambiar foto modelo
  abrirSelectorDeArchivos() {
    // Hacer clic en el elemento de entrada de archivos
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  cambiarImagen(event: any) {
    const file = event.target.files[0];
    
    if (file) {
      // Aquí puedes realizar lógica para cargar la imagen, por ejemplo, subirla a un servidor
      // y actualizar la propiedad piece.image con la nueva URL de la imagen cargada.
      // En este ejemplo, simplemente se establecerá la URL del archivo local.
      const reader = new FileReader();
      reader.onload = () => {
        this.newImage = reader.result as string || "../../../../assets/images/piezas/defualt_image.png";
      };
      reader.readAsDataURL(file);
    }
  }

  borrarImagen(){
    this.newImage = "../../../../assets/images/piezas/defualt_image.png";
  }

  volver() {
    this.location.back();
  }
}
