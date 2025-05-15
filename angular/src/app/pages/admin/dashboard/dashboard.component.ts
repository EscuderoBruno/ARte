import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../../commons/admin/breadcrumb/breadcrumb.service'
import { PieceService, Pieza, PiezaLista } from '../piezas/pieza-servicio.service';
import { Sala, SalaService } from '../salas/sala-servicio.service';
import { Exposicion, ExposicionService } from '../exposiciones/exposicion-service.service';
import { JuegoLista, JuegoService } from '../juegos/juego-servicio.service';
import { DataEscaneoPieza, escaneoPieza, escaneoService, escaneoJuego } from '../../../services/escaneo.service';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Data } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

enum FiltroOption {
  Dia = 'D',
  Semana = 'S',
  Mes = 'M',
  Año = 'A'
}

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

  filtros = {
    nombre: new FormControl(''),
    exposicion: new FormControl('0'),
    numero: new FormControl(10),
    pagina: 1,
  }

  // Gráfico
  pieChartDataValues: any[] = []; // Datos de ejemplo para las barras
  pieChartDataNames: any[] = [];
  pieChartDataValues2: any[] = []; // Datos de ejemplo para las barras
  pieChartDataNames2: any[] = [];
  barChartDataValues: any[] = []; // Datos de ejemplo para las barras
  barChartDataNames: any[] = [];
  barChartTitle: string = "";
  dataEscaneoPieza: DataEscaneoPieza[] = [];
  fechaActual: Date = new Date();
  fechaFiltro: Date = new Date(this.fechaActual);
  opcionFiltro: FiltroOption = FiltroOption.Mes;
  diaFiltro: number = 0;
  semanaFiltro: number = 0;
  añoFiltro: number = 0;
  mesFiltro: number = 0;

  // Info general
  totalUsuarios: number = 0;
  totalPiezas: number = 0;
  totalEscaneos: number = 0;
  totalPartidasAlcudio: number = 0;
  usoMotorGrafico: string = "";
  usoAudio: string = "";
  tiempoSesion: string = "";
  tiempoJuego: string = "";
  diferenciaEscaneos: number = 0;
  contadorAdultos: number = 0;
  juegos_finalizados: string = "";
  totalEscaneosJuego: number = 0;

  // Opciones desplegables
  opcionSeleccionada: string = "Uso motor gráfico";
  valorOpcionSeleccionada: string = "";
  // Opciones listas
  listaSeleccionada: string = "Piezas más escaneadas";
  valorlistaSeleccionada: any[] = [];

  // Otros
  editor: Editor | null = null;
  ultima_sesion: string = "";

  pieces: PiezaLista[] = [];
  sortedPieces: PiezaLista[] = [];
  totalTabla1: Number[] = [];
  salas: Sala[] = [];
  sortedSalas: Sala[] = [];
  exposiciones: Exposicion[] = [];
  sortedExposiciones: Exposicion[] = [];
  escaneos: escaneoPieza[] = [];
  escaneos_juego: escaneoJuego[] = [];
  juegos: JuegoLista[] = [];
  sortedJuegos: JuegoLista[] = [];

  constructor(private pieceService: PieceService, 
      private salaService: SalaService, 
      private exposicionService: ExposicionService, 
      private escaneoService: escaneoService,
      private juegoService: JuegoService,
      private breadcrumbService: BreadcrumbService,
      private cookies: CookieService,
      private http: HttpClient) 
      {

       }

  ngOnInit(): void {
    // Obtener usario y ultima sesión
    this.getEditor();
    // Obtener la opción de filtro guardada en sessionStorage
    /*const filtroOption = sessionStorage.getItem('filtroOption');
    if (filtroOption) {
      this.opcionFiltro = filtroOption as FiltroOption;
    } else {
      sessionStorage.setItem('filtroOption', this.opcionFiltro);
    }*/
    // Obtener la opción de desplegable guardada en sessionStorage
    const desplegableOption = sessionStorage.getItem('desplegableOption');
    if (desplegableOption) {
      this.opcionSeleccionada = desplegableOption;
      this.updateDesplegable(desplegableOption); // Actualizar la lista según la opción guardada
    } else {
      sessionStorage.setItem('desplegableOption', this.opcionSeleccionada);
    }
    // Obtener la opción de lista guardada en sessionStorage
    const listaOption = sessionStorage.getItem('listaOption');
    if (listaOption) {
      this.listaSeleccionada = listaOption;
      this.updateLista(listaOption); // Actualizar la lista según la opción guardada
    } else {
      sessionStorage.setItem('listaOption', this.listaSeleccionada);
    }
    // Obtener la fecha
    this.fechaActual = new Date();
    this.fechaFiltro = this.fechaActual;
    this.añoFiltro = this.fechaActual.getFullYear();
    this.mesFiltro = (this.fechaActual.getMonth() + 1);
    this.semanaFiltro = this.fechaActual.getDate();
    this.diaFiltro = this.fechaActual.getDate();
    let mesFiltroString = this.mesFiltro.toString().padStart(2, '0');

    // Obtener los datos del gráfico de barras y circular
    var radioButton = document.querySelector('input[type="radio"][name="toggle"][value="' + this.opcionFiltro + '"]');
    if (radioButton && radioButton instanceof HTMLInputElement) {
      radioButton.checked = true;
    }
    this.onToggleChange({ target: { value: this.opcionFiltro } });

    this.escaneoService.getIndicadorUsuarios().subscribe(data => {
      this.pieChartDataValues = data.values;
      this.pieChartDataNames = data.names;
      //this.totalPartidasAlcudio = data.values[1];
      this.totalUsuarios = data.values[0] + data.values[1];
      if (this.opcionSeleccionada === "Usuarios totales") {
        this.valorOpcionSeleccionada = this.totalUsuarios.toString();
      }
    });

    this.escaneoService.getAllEscaneosPiezas().subscribe(data => {
      this.escaneos = data;
      this.totalEscaneos = data.length;
    });
  
    // Obtener todas las piezas
    this.pieceService
      .getLista('es')
      .subscribe((data) => {
        this.pieces = data.piezas;
        this.sortedPieces = [...this.pieces]; // Asegurar que sortedPieces tenga un valor asignado
    });
  
    // Obtener todas las salas
    this.salaService.getAll().subscribe(data => {
      this.salas = data;
    });
  
    // Obtener todas las exposiciones
    this.exposicionService.getAll().subscribe(data => {
      this.exposiciones = data;
    });
  
    // Get Indicadores
    this.getMasEscaneos();
    this.getJuegosMasEscaneados();
    this.getEstadisticasJuegos();
    // Inicializar gráficos
    this.inicializarGráficos();
    // Actualizar el título de la página dinámicamente
    this.breadcrumbService.updateBreadcrumb('', ['']);
} 
        

  // Grafico 1 Opciones

  inicializarGráficos() {
    this.pieceService
    .getLista('es')
    .subscribe((data) => {
      this.totalPiezas = data.piezas.length;
    });
    let mesAnterior;
    let mesFiltroString = (this.fechaActual.getMonth()+1).toString().padStart(2, '0');
    let mesAnteriorFiltroString = (this.fechaActual.getMonth()).toString().padStart(2, '0');
    this.escaneoService.getFiltroEscaneosPieza(this.fechaActual.getFullYear().toString(),mesFiltroString).subscribe(data => {
      //'this'.totalEscaneos = data.values.reduce((total, valor) => total + valor, 0);
      this.escaneoService.getFiltroEscaneosPieza(this.fechaActual.getFullYear().toString(),mesAnteriorFiltroString).subscribe(data => {
        mesAnterior = data.values.reduce((total, valor) => total + valor, 0);
        this.diferenciaEscaneos = ((this.totalEscaneos - mesAnterior) / mesAnterior) * 100;
        this.diferenciaEscaneos = parseFloat(this.diferenciaEscaneos.toFixed(0));          
      });
    });
  }

  onToggleChange(event: any) {
    if (event.target.value) {
      this.opcionFiltro = event.target.value;
    } else {
      this.opcionFiltro = event;
    }
    // Guardar la opción seleccionada en sessionStorage
    sessionStorage.setItem('filtroOption', this.opcionFiltro);
    // Resto del código...
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

  // Desplegables gráficos

  updateDesplegable(option: string) {
    this.opcionSeleccionada = option;
    sessionStorage.setItem('desplegableOption', this.opcionSeleccionada); // Guardar la opción seleccionada en sessionStorage
    // Resto del código...
    if (this.opcionSeleccionada == "Uso motor gráfico") {
      this.getUsoMotorGráfico();
      this.valorOpcionSeleccionada = this.usoMotorGrafico;
    } else if (this.opcionSeleccionada == "Uso reproductor de audio") {
      this.getUsoAudio();
      this.valorOpcionSeleccionada = this.usoAudio;
    } else if (this.opcionSeleccionada == "Tiempo medio por sesión") {
      this.getTiempoMedioPorSesion();
      this.valorOpcionSeleccionada = this.tiempoSesion;
    } else if (this.opcionSeleccionada == "Juegos finalizados") {
      this.getEstadisticasJuegos();
      this.valorOpcionSeleccionada = this.juegos_finalizados;
    } else if (this.opcionSeleccionada == "Usuarios totales") {
      this.valorOpcionSeleccionada = this.totalUsuarios.toString();
    } else if (this.opcionSeleccionada == "Tiempo medio jugando") {
      this.getTiempoMedioPorJuego();
      this.valorOpcionSeleccionada = this.tiempoJuego;
    }
  }

  updateLista(option: string) {
    this.listaSeleccionada = option;
    sessionStorage.setItem('listaOption', this.listaSeleccionada); // Guardar la opción seleccionada en sessionStorage
    // Resto del código...
    if (option === "Piezas más escaneadas") {
      this.valorlistaSeleccionada = this.sortedPieces;
    } else if (option === "Exposiciones con más escaneos") {
      this.valorlistaSeleccionada = this.sortedExposiciones;
    } else if (option === "Salas con más escaneos") {
      this.valorlistaSeleccionada = this.sortedSalas;
    } else if (option === "Juegos más jugados") {
      this.valorlistaSeleccionada = this.sortedJuegos;
    }
  }  

  // Obtener estadisticas

  getMasEscaneos() {
    // Obtener todas las exposiciones
    this.exposicionService.getAll().subscribe((exposiciones) => {
      this.exposiciones = exposiciones;
      this.sortedExposiciones = [...this.exposiciones];
  
      // Obtener todas las salas
      this.salaService.getAll().subscribe((salas) => {
        this.salas = salas;
        this.sortedSalas = [...this.salas];
  
        // Obtener todas las piezas
        this.pieceService.getLista('es').subscribe((piecesData) => {
          this.pieces = piecesData.piezas;
          this.sortedPieces = [...this.pieces];
  
          // Para cada pieza, obtener sus escaneos y calcular el total
          this.pieces.forEach((piece, index) => {
            this.escaneoService.getAllEscaneosPieza(piece.id).subscribe((escaneos) => {
              const escaneosCount = escaneos.length;
  
              // Sumar el total de escaneos para la pieza actual
              piece.totalEscaneos = escaneosCount;
  
              // Sumar el total de escaneos a la sala correspondiente
              const sala = this.salas.find((sala) => sala.id === piece.sala_id);
              if (sala) {
                sala.totalEscaneos = (sala.totalEscaneos || 0) + escaneosCount;
              }
  
              // Sumar el total de escaneos a la exposición correspondiente
              const exposicion = this.exposiciones.find((exposicion) => exposicion.id === sala?.exposicion_id);
              if (exposicion) {
                exposicion.totalEscaneos = (exposicion.totalEscaneos || 0) + escaneosCount;
              }
  
              // Cuando se procesen todos los escaneos de piezas, ordenar y actualizar la lista
              if (index === this.pieces.length - 1) {
                this.sortedSalas.sort((a, b) => (b.totalEscaneos || 0) - (a.totalEscaneos || 0));
                this.sortedExposiciones.sort((a, b) => (b.totalEscaneos || 0) - (a.totalEscaneos || 0));
                this.sortedPieces.sort((a, b) => (b.totalEscaneos || 0) - (a.totalEscaneos || 0));
                if (this.listaSeleccionada === "Piezas más escaneadas") {
                  this.updateLista('Piezas más escaneadas');
                }
                if (this.listaSeleccionada === "Exposiciones con más escaneos") {
                  this.updateLista('Exposiciones con más escaneos');
                }
                if (this.listaSeleccionada === "Salas con más escaneos") {
                  this.updateLista('Salas con más escaneos');
                } 
                if (this.listaSeleccionada === "Juegos más jugados") {
                  this.updateLista('Juegos más jugados');
                } 
              }
            });
          });
        });
      });
    });
  } 
  
  getJuegosMasEscaneados() {
    // Obtener todos los juegos
    this.juegoService.getAll(this.filtros).subscribe(data => {
      this.juegos = data.juegos;
      this.sortedJuegos = [...this.juegos];
  
      // Para cada juego, obtener sus escaneos y calcular el total
      this.juegos.forEach((juego, index) => {
        this.escaneoService.getAllEscaneosJuego(juego.id).subscribe((escaneos) => {
          const escaneosCount = escaneos.length;

          // Sumar el total de escaneos para el juego actual
          juego.totalEscaneos = escaneosCount;

          // Cuando se procesen todos los escaneos de piezas, ordenar y actualizar la lista
          if (index === this.juegos.length - 1) {
            this.sortedJuegos.sort((a, b) => (b.totalEscaneos || 0) - (a.totalEscaneos || 0));
          }
        });
      });
    });
  }  

  getEditor(){
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

  getEstadisticasJuegos() {
    let totalJuegosFinalizados = 0; // Variable local para almacenar el total de uso de motor gráfico
    this.escaneoService.getAllEscaneosJuegos().subscribe(data => {
      this.escaneos_juego = data;
      this.totalEscaneosJuego = data.length;
      for (let i = 0; i < this.escaneos_juego.length; i++) {
        this.totalPartidasAlcudio++;
        if (this.escaneos_juego[i].finalizado == 1) {
          totalJuegosFinalizados++;
        }
      }
      this.juegos_finalizados = parseFloat((totalJuegosFinalizados / this.totalEscaneosJuego * 100).toFixed(2)).toString()+"%";
      if (this.opcionSeleccionada === "Juegos finalizados") {
        this.valorOpcionSeleccionada = this.juegos_finalizados;
      }
    })
  }

  getUsuarios() {
    this.escaneoService.getIndicadorUsuarios().subscribe(data => {
      this.pieChartDataValues = data.values;
      this.pieChartDataNames = data.names;
    });
  } 

  getUsoIdiomas() {
    this.escaneoService.getUsoIdiomas().subscribe(data => {
      this.pieChartDataValues2 = data.values;
      this.pieChartDataNames2 = data.names;
    });
  }

  getUsoMotorGráfico() {
    let totalUsoMotorGrafico = 0; // Variable local para almacenar el total de uso de motor gráfico
    this.escaneoService.getAllEscaneosPiezas().subscribe(data => {
      this.escaneos = data;
      this.totalEscaneos = data.length;
      for (let i = 0; i < this.escaneos.length; i++) {
        if (this.escaneos[i].motor_grafico == 1) {
          totalUsoMotorGrafico++;
        }
      }
      this.usoMotorGrafico = parseFloat((totalUsoMotorGrafico / this.totalEscaneos * 100).toFixed(2)).toString()+"%";
      if (this.opcionSeleccionada === "Uso motor gráfico") {
        this.valorOpcionSeleccionada = this.usoMotorGrafico;
      }
      console.log(this.listaSeleccionada);
    });
  }

  getUsoAudio() {
    this.escaneoService.getAllEscaneosPiezas().subscribe(data => {
      this.escaneos = data;
      this.totalEscaneos = data.length;
      let sumaEscaneos = 0;
      for (let i = 0; i < this.escaneos.length; i++) {
        if (this.escaneos[i].audio == 1) {
          sumaEscaneos++;
        }
      }
      this.usoAudio = parseFloat((sumaEscaneos / this.totalEscaneos * 100).toFixed(2)).toString()+"%";
      if (this.opcionSeleccionada === "Uso reproductor de audio") {
        this.valorOpcionSeleccionada = this.usoAudio;
      }
    });
  }

  getTiempoMedioPorSesion() {
    this.escaneoService.getAllEscaneosPiezas().subscribe(data => {
      this.escaneos = data;
      this.totalEscaneos = data.length;
      let sumaTotalTiempo = 0;
      for (let i = 0; i < this.escaneos.length; i++) {
        const tiempo = this.escaneos[i].tiempo;
        if (tiempo !== undefined && typeof tiempo === 'number') {
          sumaTotalTiempo += tiempo;
        }
      }
      let tiempoSesionEnSegundos = parseFloat((sumaTotalTiempo / this.totalEscaneos).toFixed(2));
      this.tiempoSesion = this.segundosAFormatoTiempo(tiempoSesionEnSegundos);
      if (this.opcionSeleccionada === "Tiempo medio por sesión") {
        this.valorOpcionSeleccionada = this.tiempoSesion;
      }
    });
  }

  getTiempoMedioPorJuego() {
    this.escaneoService.getAllEscaneosJuegos().subscribe(data => {
      this.escaneos = data;
      this.totalEscaneos = data.length;
      let sumaTotalTiempo = 0;
      for (let i = 0; i < this.escaneos.length; i++) {
        const tiempo = this.escaneos[i].tiempo;
        if (tiempo !== undefined && typeof tiempo === 'number') {
          sumaTotalTiempo += tiempo;
        }
      }
      let tiempoSesionEnSegundos = parseFloat((sumaTotalTiempo / this.totalEscaneos).toFixed(2));
      this.tiempoJuego = this.segundosAFormatoTiempo(tiempoSesionEnSegundos);
      if (this.opcionSeleccionada === "Tiempo medio jugando") {
        this.valorOpcionSeleccionada = this.tiempoJuego;
      }
    });
  }

  // Otros

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

  segundosAFormatoTiempo(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = Math.floor(segundos % 60);
  
    if (horas === 0) {
      const formatoMinutos = minutos < 10 ? `0${minutos}` : `${minutos}`;
      const formatoSegundos = segundosRestantes < 10 ? `0${segundosRestantes}` : `${segundosRestantes}`;
      return `${formatoMinutos}min ${formatoSegundos}s`;
    } else {
      const formatoHoras = horas < 10 ? `0${horas}` : `${horas}`;
      const formatoMinutos = minutos < 10 ? `0${minutos}` : `${minutos}`;
      const formatoSegundos = segundosRestantes < 10 ? `0${segundosRestantes}` : `${segundosRestantes}`;
      return `${formatoHoras}:${formatoMinutos}:${formatoSegundos}`;
    }
  }

  isFirstElement(index: number): boolean {
    return index === 0;
  }
  
}
