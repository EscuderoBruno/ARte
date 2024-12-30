import { Component, Output, EventEmitter, Input } from "@angular/core";
import { PieceService, Pieza, PiezaLista } from '../../pages/admin/piezas/pieza-servicio.service';
import { DateService } from '../../services/date.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Idioma, IdiomaService } from '../../services/idioma.service';
import { Sala, SalaService } from '../../pages/admin/salas/sala-servicio.service';
import { environment } from '../../../environments/environment';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-piezas-selector',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './piezas-selector.component.html',
  styleUrl: './piezas-selector.component.css'
})
export class PiezasSelectorComponent {

  piezas_api: PiezaLista[] = [];
  idiomas: Idioma[] = [];
  salas: Sala[] = [];
  filtros = {
    nombre: new FormControl(''),
    sala: new FormControl('0'),
  }
  baseAPI = environment.apiURL;
  
  @Input() piezaSeleccionadaInp: PiezaLista | null = null;
  @Input() piezasAnadidas: Array<PiezaLista> = [];
  @Output() piezaSeleccionada = new EventEmitter<PiezaLista | null>();
  
  constructor(
    private piezasService: PieceService,
    private dateService: DateService,
    private idiomaService: IdiomaService,
    private salaService: SalaService
  ) {}

  ngOnInit(): void {
    this.piezasService.getLista('es').subscribe(data => {
      this.piezas_api = data.piezas;
    })
    this.idiomaService.getAll().subscribe(data => {
      this.idiomas = data;
    })
    this.salaService.getAll().subscribe(data => {
      this.salas = data;
    })
    this.filtrarPiezas()
  }

  selectPieza(evt: any){
    evt.preventDefault();
    const fila: HTMLElement = evt.target.parentElement;
    const id = fila.getAttribute('id')?.substring(4) || null;
    const pieza = this.piezas_api.find(e => e.id === id);
    if(pieza){
      this.piezaSeleccionada.emit(pieza);
    }
  }

  formatearFecha(date: string): string {
    const fecha = new Date(date);
    return this.dateService.transformarFecha(fecha, 'es');
  }
  
  filtrarPiezas(){
    this.piezasService.getLista('es', this.filtros).subscribe(data => {
      console.log(this.piezas_api, this.piezasAnadidas)
      this.piezas_api = data.piezas.filter(pieza => {
        return !this.containsObject(pieza, this.piezasAnadidas) && pieza.imagen != null
      });
      console.log(this.piezas_api)
    });
  }

  containsObject(obj: PiezaLista, list: PiezaLista[]) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].id === obj.id) {
            return true;
        }
    }

    return false;
}
}


