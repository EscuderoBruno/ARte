import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../../commons/admin/breadcrumb/breadcrumb.service'
import { PieceService, Pieza, PiezaLista } from '../piezas/pieza-servicio.service';
import { Sala, SalaService } from '../salas/sala-servicio.service';
import { DataEscaneoPieza, escaneoService } from '../../../services/escaneo.service';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

export interface Editor {
  nombre: string,
  correo: string,
  contrasenya: string,
  ultima_sesion: Date
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  // Gráfico
  barChartDataValues: any[] = []; // Datos de ejemplo para las barras
  barChartDataNames: any[] = [];
  barChartTitle: string = "";
  dataEscaneoPieza: DataEscaneoPieza[] = [];
  fechaActual: Date = new Date();
  fechaFiltro: Date = new Date(this.fechaActual);
  opcionFiltro: string = "M";
  diaFiltro: number = 0;
  semanaFiltro: number = 0;
  añoFiltro: number = 0;
  mesFiltro: number = 0;

  // Info general
  totalPiezas: number = 0;
  totalEscaneos: number = 0;
  diferenciaEscaneos: number = 0;

  // Otros
  editor: Editor | null = null;
  ultima_sesion: string = "";

  pieces: PiezaLista[] = [];
  sortedPieces: PiezaLista[] = [];
  totalTabla1: Number[] = [];
  salas: Sala[] = [];

  constructor(private pieceService: PieceService, 
              private salaService: SalaService, 
              private escaneoService: escaneoService,
              private breadcrumbService: BreadcrumbService,
              private cookies: CookieService,
              private http: HttpClient) { }

  ngOnInit(): void {
    // Obtener usario y ultima sesión
    this.getUsuario();
    // Obtener la fecha
    this.fechaActual = new Date();
    this.fechaFiltro = this.fechaActual;
    this.añoFiltro = this.fechaActual.getFullYear();
    this.mesFiltro = (this.fechaActual.getMonth() + 1);
    this.semanaFiltro = this.fechaActual.getDate();
    this.diaFiltro = this.fechaActual.getDate();
    let mesFiltroString = this.mesFiltro.toString().padStart(2, '0');
    this.escaneoService.getFiltroEscaneosPieza(this.añoFiltro.toString(),mesFiltroString).subscribe(data => {
      this.barChartDataValues = data.values;
      this.barChartDataNames = data.names;
      this.barChartTitle = data.title;
    });
    // Obtener todas las piezas
    this.pieceService
      .getLista('es')
      .subscribe((data) => {
        this.pieces = data.piezas;
        console.log(data);
    });
    // Obtener todas las salas
    this.salaService.getAll().subscribe(data => {
      this.salas = data;
      console.log(data);
    });
    // Get Lista Tabla 1
    this.getPiezasMasEscaneadas();
    // Inicializar gráficos
    this.inicializarGráficos();
    // Actualizar el título de la página dinámicamente
    this.breadcrumbService.updateBreadcrumb('', []); 
  }

  inicializarGráficos() {
    // Piezas
    this.pieceService
    .getLista('es')
    .subscribe((data) => {
      this.totalPiezas = data.piezas.length;
    });
    // Escaneos
    let mesAnterior;
    let mesFiltroString = (this.fechaActual.getMonth()+1).toString().padStart(2, '0');
    let mesAnteriorFiltroString = (this.fechaActual.getMonth()).toString().padStart(2, '0');
    this.escaneoService.getFiltroEscaneosPieza(this.fechaActual.getFullYear().toString(),mesFiltroString).subscribe(data => {
      this.totalEscaneos = data.values.reduce((total, valor) => total + valor, 0);
      this.escaneoService.getFiltroEscaneosPieza(this.fechaActual.getFullYear().toString(),mesAnteriorFiltroString).subscribe(data => {
        mesAnterior = data.values.reduce((total, valor) => total + valor, 0);
        this.diferenciaEscaneos = ((this.totalEscaneos - mesAnterior) / mesAnterior) * 100;
      });
    });
  }

  onToggleChange(event: any) {
    console.log('Opción seleccionada:', event.target.value);
    this.opcionFiltro = event.target.value;
    let mesFiltroString = this.mesFiltro.toString().padStart(2, '0');
    let semanaFiltroString = "";
    if (this.fechaActual.getDay() == 0) {
      semanaFiltroString = "7";
    } else {
      semanaFiltroString = (this.semanaFiltro - (this.fechaActual.getDay()-1)).toString();
    }
    console.log(semanaFiltroString);
    // Aquí puedes realizar la lógica correspondiente según la opción seleccionada
    if (event.target.value === 'D') {
      this.escaneoService.getFiltroEscaneosPieza(this.añoFiltro.toString(), mesFiltroString, "", this.diaFiltro.toString()).subscribe(data => {
        this.barChartDataValues = data.values;
        this.barChartDataNames = data.names;
        this.barChartTitle = data.title;
        console.log(data.title);
      });
    } else if (event.target.value === 'S') {
      this.escaneoService.getFiltroEscaneosPieza(this.añoFiltro.toString(),mesFiltroString,semanaFiltroString).subscribe(data => {
        this.barChartDataValues = data.values;
        this.barChartDataNames = data.names;
        this.barChartTitle = data.title;
      });
    } else if (event.target.value === 'M') {
      this.escaneoService.getFiltroEscaneosPieza(this.añoFiltro.toString(),mesFiltroString).subscribe(data => {
        this.barChartDataValues = data.values;
        this.barChartDataNames = data.names;
        this.barChartTitle = data.title;
      });
    } else if (event.target.value === 'A') {
      this.escaneoService.getFiltroEscaneosPieza(this.añoFiltro.toString()).subscribe(data => {
        this.barChartDataValues = data.values;
        this.barChartDataNames = data.names;
        this.barChartTitle = data.title;
      });
    }
  }

  getPiezasMasEscaneadas() {
    // Obtener todas las piezas
    this.pieceService.getLista('es').subscribe((data) => {
        this.pieces = data.piezas;
        this.sortedPieces = [...this.pieces];
        for (let i = 0; i < this.pieces.length; i++) {
          let piece = this.pieces[i];
          console.log(piece.id);
          this.escaneoService.getAllEscaneosPieza(piece.id).subscribe(data => {
            piece.totalEscaneos = data.length;
              this.sortedPieces.sort((a, b) => {
                  // Verificar si a.totalEscaneos o b.totalEscaneos es undefined
                  if (a.totalEscaneos === undefined || b.totalEscaneos === undefined) {
                      return 0; // No hacemos nada si uno de los valores es undefined
                  }
                  // Comparar los valores normalmente si ambos están definidos
                  return b.totalEscaneos - a.totalEscaneos;
              });
          });
        }
    });
  }

  getUsuario(){
    let userToken = this.cookies.get('withuUserToken')
    this.http.get<Editor>(environment.apiURL + '/auth/editor', {
      headers: {
        'Authorization': 'Bearer ' + userToken
      }
    }).subscribe((data) => {
      this.editor = data;
      const fechaHora = new Date(data.ultima_sesion);
      const año = fechaHora.getFullYear();
      const mes = (fechaHora.getMonth() + 1).toString().padStart(2, '0'); // Sumar 1 al mes ya que los meses son indexados desde 0
      const dia = fechaHora.getDate().toString().padStart(2, '0');
      const hora = fechaHora.getHours().toString().padStart(2, '0');
      const minuto = fechaHora.getMinutes().toString().padStart(2, '0');
      const segundo = fechaHora.getSeconds().toString().padStart(2, '0');
      this.ultima_sesion = `${dia}/${mes}/${año} ${hora}:${minuto}:${segundo}`;
      console.log(this.ultima_sesion);
    }, (error: HttpErrorResponse) => {
      console.error(error.error.error)
      location.href = '/login';
    })
  }

  paginacion(numero: Number) {
    if (this.opcionFiltro == "A") {
      if (numero == 0) {
        this.añoFiltro--;
      } else {
        if (this.añoFiltro != this.fechaActual.getFullYear()) {
          this.añoFiltro++;
        }
      }
      this.escaneoService.getFiltroEscaneosPieza(this.añoFiltro.toString()).subscribe(data => {
        this.barChartDataValues = data.values;
        this.barChartDataNames = data.names;
        this.barChartTitle = data.title;
      });
    } else if (this.opcionFiltro == "M") {
      if (numero == 0) {
        if (this.mesFiltro == 1) {
          this.mesFiltro = 12;
          this.añoFiltro--
        } else {
          this.mesFiltro--;
        }
      } else {
        if (this.mesFiltro != this.fechaActual.getMonth()+1 || this.añoFiltro != this.fechaActual.getFullYear()) {
          if (this.mesFiltro == 12) {
            this.mesFiltro = 1;
            this.añoFiltro++;
          } else {
            this.mesFiltro++;
          }
        }
      }
      let mesFiltroString = this.mesFiltro.toString().padStart(2, '0');
      this.escaneoService.getFiltroEscaneosPieza(this.añoFiltro.toString(),mesFiltroString).subscribe(data => {
        this.barChartDataValues = data.values;
        this.barChartDataNames = data.names;
        this.barChartTitle = data.title;
      });
    } else if( this.opcionFiltro == "S") {
      console.log(this.fechaFiltro);
      console.log(this.fechaActual)
      if (numero == 0) {
        const nuevaFecha = new Date(this.fechaFiltro); // Crear una nueva instancia de Date basada en this.fechaFiltro
        nuevaFecha.setDate(nuevaFecha.getDate() - 7); // Modificar la nueva fecha
        this.fechaFiltro = nuevaFecha; // Asignar la nueva fecha a this.fechaFiltro
      } else {
        if (this.fechaFiltro.getDate() != this.fechaActual.getDate() || this.mesFiltro != this.fechaActual.getMonth()+1 || this.añoFiltro != this.fechaActual.getFullYear()) {
          const nuevaFecha = new Date(this.fechaFiltro); // Crear una nueva instancia de Date basada en this.fechaFiltro
          nuevaFecha.setDate(nuevaFecha.getDate() + 7); // Modificar la nueva fecha
          this.fechaFiltro = nuevaFecha; // Asignar la nueva fecha a this.fechaFiltro
        }
      }
      this.semanaFiltro = this.fechaFiltro.getDate();
      this.añoFiltro = this.fechaFiltro.getFullYear();
      let mesFiltroString = (this.fechaFiltro.getMonth() + 1).toString().padStart(2, '0');
      this.escaneoService.getFiltroEscaneosPieza(this.añoFiltro.toString(),mesFiltroString,this.semanaFiltro.toString()).subscribe(data => {
        this.barChartDataValues = data.values;
        this.barChartDataNames = data.names;
        this.barChartTitle = data.title;
      });
    } else if (this.opcionFiltro == "D") {
      if (numero == 0) {
        const nuevaFecha = new Date(this.fechaFiltro); // Crear una nueva instancia de Date basada en this.fechaFiltro
        nuevaFecha.setDate(nuevaFecha.getDate() - 1); // Modificar la nueva fecha
        this.fechaFiltro = nuevaFecha; // Asignar la nueva fecha a this.fechaFiltro
      } else {
        if (this.fechaFiltro.getDate() != this.fechaActual.getDate() || this.mesFiltro != this.fechaActual.getMonth()+1 || this.añoFiltro != this.fechaActual.getFullYear()) {
          const nuevaFecha = new Date(this.fechaFiltro); // Crear una nueva instancia de Date basada en this.fechaFiltro
          nuevaFecha.setDate(nuevaFecha.getDate() + 1); // Modificar la nueva fecha
          this.fechaFiltro = nuevaFecha; // Asignar la nueva fecha a this.fechaFiltro
        }
      }
      let diaFiltro = (this.fechaFiltro.getDate()).toString().padStart(2, '0');
      this.añoFiltro = this.fechaFiltro.getFullYear();
      let mesFiltroString = (this.fechaFiltro.getMonth() + 1).toString().padStart(2, '0');
      this.escaneoService.getFiltroEscaneosPieza(this.añoFiltro.toString(),mesFiltroString,"",diaFiltro).subscribe(data => {
        this.barChartDataValues = data.values;
        this.barChartDataNames = data.names;
        this.barChartTitle = data.title;
      });
    }
  }
  
}
