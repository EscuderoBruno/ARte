import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface SidebarItem {
  title: string,
  icon: string,
  selected: boolean,
  link: string
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    const ruta: string = this.location.path();
    console.log('ruta: ', ruta)
    this.seleccionarItem(this.sidebarItems.findIndex(item => item.link.split('/')[2] === ruta.split('/')[2]))
  }

  sidebarItems: SidebarItem[] = [
    {
      title: 'Inicio',
      icon: 'mdi-view-dashboard',
      selected: false,
      link: '/administrador'
    },
    {
      title: 'Indicadores',
      icon: 'mdi-chart-bar',
      selected: false,
      link: '/administrador/indicadores'
    },
    {
      title: 'Exposiciones',
      icon: 'mdi-map',
      selected: false,
      link: '/administrador/exposiciones'
    },
    {
      title: 'Salas',
      icon: 'mdi-border-all',
      selected: false,
      link: '/administrador/salas'
    },
    {
      title: 'Piezas',
      icon: 'mdi-image-multiple',
      selected: false,
      link: '/administrador/piezas'
    },
    {
      title: 'Juegos',
      icon: 'mdi-puzzle',
      selected: false,
      link: '/administrador/juegos'
    }
  ]

  seleccionarItem(index: number){
    this.sidebarItems.map(item => { item.selected = false })
    this.sidebarItems[index].selected = true;
    console.log(index, this.sidebarItems)
  }

}
