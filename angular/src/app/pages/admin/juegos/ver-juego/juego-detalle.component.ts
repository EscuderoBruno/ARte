import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BreadcrumbService } from '../../../../commons/admin/breadcrumb/breadcrumb.service';
import { Juego, JuegoService } from '../juego-servicio.service';

@Component({
  selector: 'app-juego-detalle',
  templateUrl: './juego-detalle.component.html',
  styleUrls: ['./juego-detalle.component.css']
})
export class JuegoDetalleComponent implements OnInit {
  juegoId: string | null = null;
  juego: Juego | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private juegoService: JuegoService,
    private breadcrumbService: BreadcrumbService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.juegoId = idParam;
        this.juegoService.getOne(this.juegoId).subscribe((juego: Juego) => {
          this.juego = juego;
          // Actualizar el título de la página dinámicamente
          if (this.juego) {
            this.breadcrumbService.updateBreadcrumb('Información', ['Home', 'Juegos', this.juego.nombre]);
          }
        });
      } else {
        // Si no se proporciona un ID específico, obtener el primer juego o manejarlo según sea necesario
        // this.juegoService.getAll().subscribe(juegos => {
        //   if (juegos.length > 0) {
        //     this.juego = juegos[0]; // Tomando el primer juego, podrías implementar otra lógica aquí
        //     if (this.juego) {
        //       this.breadcrumbService.updateBreadcrumb('Información', ['Home', 'Juegos', this.juego.nombre]);
        //     }
        //   }
        // });
      }
    });
  }

  // Método para navegar a la ruta que incluye /editar
  navigateToEditar() {
    // Obtén la ruta actual
    const currentUrl = this.router.url;

    // Comprueba si ya estás en la ruta que incluye /editar
    if (currentUrl.includes('/editar')) {
      // Ya estás en la ruta deseada, no es necesario navegar
      console.log('Ya estás en la ruta que incluye /editar');
    } else {
      // Construye la nueva ruta y navega a ella
      const nuevaRuta = currentUrl + '/editar';
      this.router.navigate([nuevaRuta]);
    }
  }

  volver() {
    this.location.back();
  }
}
