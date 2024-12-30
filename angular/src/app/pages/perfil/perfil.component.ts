import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbService } from '../../commons/admin/breadcrumb/breadcrumb.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'

export interface Editor {
  nombre: string,
  correo: string,
  contrasenya: string
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  flagUrl: string = 'flag_1.jpg';

  nuevoPerfil = new FormGroup({
    usuario: new FormControl<string>('', [Validators.required]),
    correo: new FormControl<string>(''),
    contraseña: new FormControl<string>(''),
  });

  constructor(private breadcrumbService: BreadcrumbService,
              private cookies: CookieService,
              private http: HttpClient,
              private location: Location) { }

  ngOnInit(): void {

    this.getUsuario()

    // Actualizar el título de la página dinámicamente
    this.breadcrumbService.updateBreadcrumb('Configuración del perfil', ['Inicio', 'Perfil']);
  }

  changeLanguage(imageFlag: string){
    this.flagUrl = imageFlag;
  }

  editarPerfil(event: any) {
    event.preventDefault();
    /*this.exposicionService.editOne(this.id, {
      nombre: this.nuevaExposicion.value.nombre || '',
      autores: this.nuevaExposicion.value.autores || '',
      descripcion: this.nuevaExposicion.value.descripcion || '',
      estado_id: this.nuevaExposicion.value.estado_id || '',
      fecha_inicio: new Date(this.nuevaExposicion.value.fecha_inicio || ''),
      fecha_fin: new Date(this.nuevaExposicion.value.fecha_fin || ''),
    }).subscribe((data: Exposicion) => {
      console.log(data);
      this.router.navigate(['/administrador/exposiciones'])
    });*/
  }

  getUsuario(){
    let userToken = this.cookies.get('withuUserToken')
    this.http.get<Editor>(environment.apiURL + '/auth/editor', {
      headers: {
        'Authorization': 'Bearer ' + userToken
      }
    }).subscribe((data) => {
      this.nuevoPerfil.setValue({
        usuario: data.nombre,
        correo: data.correo || '',
        contraseña: data.contrasenya || '',
      })
    }, (error: HttpErrorResponse) => {
      console.error(error.error.error)
      location.href = '/login';
    })
  }

  volver() {
    this.location.back();
  }
}
