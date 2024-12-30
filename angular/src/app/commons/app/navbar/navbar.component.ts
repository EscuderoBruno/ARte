import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentLanguage: string = 'flag_1.jpg';

  constructor() { }

  ngOnInit(): void {
  }

  changeLanguage(language: string): void {
    this.currentLanguage = language;
    // Aquí puedes realizar cualquier otra lógica relacionada con el cambio de idioma
  }

}
