import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

interface Message {
  transmitter: string;
  content: string;
  datetime: Date;
}

@Component({
  selector: 'app-niños',
  templateUrl: './portada_niños.component.html',
  styleUrls: ['./portada_niños.component.css', '../app-style.css']
})


export class AppPortadaNiñosComponent {

  id = this.router.url.split('/').pop() || ''

  constructor(
    private router: Router,
  ) {}


  goToGame() {
    this.router.navigate([`/alcudio/juego/${this.id}`]);
  }

}
