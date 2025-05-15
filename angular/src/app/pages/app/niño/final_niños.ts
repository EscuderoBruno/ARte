import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-final-ninos',
  templateUrl: './final_niños.component.html',
  styleUrls: ['./final_niños.component.css', '../app-style.css']
})
export class AppFinalNiñosComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  baseAPI = environment.apiURL;
  id = '';
  tiempoJuego = '';
  puntosJuego = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.tiempoJuego = this.formatTiempo(localStorage.getItem('tiempoJuego') || '0');
    this.puntosJuego = localStorage.getItem('puntosJuego') || '0';
  }

  playAgain() {
    this.router.navigate(['alcudio/juego/' + this.id]);
  }

  formatTiempo(tiempo: string) {
    const segundosTotales = Number(tiempo);
    const minutos = Math.trunc(segundosTotales / 60) || 0;
    const segundos = segundosTotales % 60 || 0;
    return `${minutos}m ${segundos}s`;
  }

  compartir() {
    // Captura de pantalla usando html2canvas
    html2canvas(document.documentElement).then(canvas => {
      // Convertir la imagen del canvas a un enlace temporal
      const imageData = canvas.toDataURL('image/png');
  
      // Verificar si la API de Web Share está disponible en el navegador
      if (navigator.share) {
        // Compartir la imagen usando la API de Web Share
        navigator.share({
          title: 'Captura de pantalla',
          files: [new File([imageData], 'screenshot.png', { type: 'image/png' })],
          text: '¡Mira esta captura de pantalla!',
        })
        .then(() => console.log('Contenido compartido correctamente.'))
        .catch(error => console.error('Error al compartir:', error));
      } else {
        // Si la API de Web Share no está disponible, mostrar un mensaje de error o proporcionar una alternativa
        console.error('La API de Web Share no está disponible en este navegador.');
        // Puedes mostrar un mensaje de error o proporcionar una alternativa como la descarga directa
        // const a = document.createElement('a');
        // a.href = imageData;
        // a.download = 'screenshot.png';
        // a.click();
      }
    });
  }  
}
