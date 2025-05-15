import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {
  Juego,
  JuegoService,
} from '../../../pages/admin/juegos/juego-servicio.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  currentLanguage: string = 'es.jpg';
  isInAlcudio: boolean = false;
  isInAlcudioFin: boolean = false;
  juego: Juego | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private juegoService: JuegoService
  ) {}

  ngOnInit(): void {
    if (this.router.url.includes('alcudio')) {
      this.isInAlcudio = true;
      const id: string = this.router.url.split('/').pop() || '';
      this.juegoService.getOne(id).subscribe((data) => {
        this.juego = data;
      });
      var contenedor = document.getElementById('idioma');
      if (contenedor) {
        contenedor.style.display = 'none';
      }
    } else {
      this.isInAlcudio = false;
      var url = window.location.href;
      var segments = url.split('/');
      var idioma = segments.pop();
      this.currentLanguage = idioma + '.jpg';
    }
  }

  changeLanguage(language: string): void {
    let currentUrl = window.location.href;
    let newUrl = currentUrl.replace(/\/[a-z]{2,3}$/, '/' + language);
    window.location.href = newUrl;
  }
}
