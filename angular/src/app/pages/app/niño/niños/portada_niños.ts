import { Component, OnInit} from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { io } from "socket.io-client";

interface Message {
  transmitter: string;
  content: string;
  datetime: Date;
}

@Component({
  selector: 'app-niños',
  templateUrl: './portada_niños.component.html',
  styleUrls: ['./portada_niños.component.css', '../../app-style.css']
})


export class AppPortadaNiñosComponent implements OnInit {

  userContent = new FormControl('');

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
  }

  goToGame() {
    this.router.navigate(['/alcudio/busqueda_del_tesoro']);
  }

}
