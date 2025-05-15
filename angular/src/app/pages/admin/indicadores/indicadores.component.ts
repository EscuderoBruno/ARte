import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../../commons/admin/breadcrumb/breadcrumb.service'
import { PieceService, Pieza, PiezaLista } from '../piezas/pieza-servicio.service';
import { Sala, SalaService } from '../salas/sala-servicio.service';
import { JuegoLista, JuegoService } from '../juegos/juego-servicio.service';
import { Exposicion, ExposicionService } from '../exposiciones/exposicion-service.service';
import { DataEscaneoPieza, escaneoPieza, escaneoService, escaneoJuego } from '../../../services/escaneo.service';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Data } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

export interface Editor {
  nombre: string,
  correo: string,
  contrasenya: string,
  ultima_sesion: Date
}

enum FiltroOption {
  Dia = 'D',
  Semana = 'S',
  Mes = 'M',
  Año = 'A'
}

@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrl: './indicadores.component.css'
})
export class IndicadoresComponent {

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
  fechaActual: Date = new Date();
  fechaFiltro: Date = new Date(this.fechaActual);
  opcionFiltro: string = "M";
  diaFiltro: number = 0;
  semanaFiltro: number = 0;
  añoFiltro: number = 0;
  mesFiltro: number = 0;

  // Info general
  totalUsuarios: number = 0;
  totalPiezas: number = 0;
  totalEscaneos: number = 0;
  totalPartidasAlcudio: number = 0;
  totalUsoMotorGrafico: number = 0;
  usoMotorGrafico: string = "";
  usoAudio: string = "";
  tiempoSesion: string = "";
  tiempoJuego: string = "";
  diferenciaEscaneos: number = 0;
  juegos_finalizados: string = "";
  totalEscaneosJuego: number = 0;

  // Opciones desplegables
  opcionSeleccionada1: string = "Seleccione una opción";
  valorOpcionSeleccionada1: string = "";
  opcionSeleccionada2: string = "Seleccione una opción";
  valorOpcionSeleccionada2: string = "";
  // Opciones listas
  listaSeleccionada1: string = "Piezas más escaneadas";
  valorlistaSeleccionada1: any[] = [];
  listaSeleccionada2: string = "Piezas más escaneadas";
  valorlistaSeleccionada2: any[] = [];
  listaSeleccionada3: string = "Piezas más escaneadas";
  valorlistaSeleccionada3: any[] = [];
  listaSeleccionada4: string = "Piezas más escaneadas";
  valorlistaSeleccionada4: any[] = [];

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
              private juegoService: JuegoService,
              private escaneoService: escaneoService,
              private breadcrumbService: BreadcrumbService,
              private cookies: CookieService,
              private http: HttpClient) { }

  ngOnInit(): void {
    // Obtener la opción de filtro guardada en sessionStorage
    const filtroOption1 = sessionStorage.getItem('filtroOption1');
    if (filtroOption1) {
      this.opcionFiltro = filtroOption1 as FiltroOption;
    } else {
      sessionStorage.setItem('filtroOption1', this.opcionFiltro);
    }
    // Obtener la opción de desplegable guardada en sessionStorage
    const desplegableOption1 = sessionStorage.getItem('desplegableOption1');
    if (desplegableOption1) {
      this.opcionSeleccionada1 = desplegableOption1;
      this.updateDesplegable(1,desplegableOption1); // Actualizar la lista según la opción guardada
    } else {
      sessionStorage.setItem('desplegableOption1', this.opcionSeleccionada1);
    }
    const desplegableOption2 = sessionStorage.getItem('desplegableOption2');
    if (desplegableOption2) {
      this.opcionSeleccionada2 = desplegableOption2;
      this.updateDesplegable(2,desplegableOption2); // Actualizar la lista según la opción guardada
    } else {
      sessionStorage.setItem('desplegableOption2', this.opcionSeleccionada2);
    }
    // Obtener la opción de lista guardada en sessionStorage
    const listaOption1 = sessionStorage.getItem('listaOption1');
    if (listaOption1) {
      this.listaSeleccionada1 = listaOption1;
      this.updateLista(1,listaOption1); // Actualizar la lista según la opción guardada
    } else {
      sessionStorage.setItem('listaOption1', this.listaSeleccionada1);
    }
    const listaOption2 = sessionStorage.getItem('listaOption2');
    if (listaOption2) {
      this.listaSeleccionada2 = listaOption2;
      this.updateLista(2,listaOption2); // Actualizar la lista según la opción guardada
    } else {
      sessionStorage.setItem('listaOption2', this.listaSeleccionada2);
    }
    const listaOption3 = sessionStorage.getItem('listaOption3');
    if (listaOption3) {
      this.listaSeleccionada3 = listaOption3;
      this.updateLista(3,listaOption3); // Actualizar la lista según la opción guardada
    } else {
      sessionStorage.setItem('listaOption3', this.listaSeleccionada3);
    }
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
    this.escaneoService.getIndicadorUsuarios().subscribe(data => {
      this.pieChartDataValues = data.values;
      this.pieChartDataNames = data.names;
      this.totalPartidasAlcudio = data.values[1];
      this.totalUsuarios = data.values[0] + data.values[1];
      if (this.opcionSeleccionada1 === "Usuarios totales") {
        this.valorOpcionSeleccionada1 = this.totalUsuarios.toString();
      } else if (this.opcionSeleccionada2 === "Usuarios totales") {
        this.valorOpcionSeleccionada2 = this.totalUsuarios.toString();
      }
    });
    this.escaneoService.getUsoIdiomas().subscribe(data => {
      this.pieChartDataValues2 = data.values;
      this.pieChartDataNames2 = data.names;
    });
    // Obtener todas las piezas
    this.pieceService
    .getLista('es')
    .subscribe((data) => {
      this.pieces = data.piezas;
      this.sortedPieces = [...this.pieces]; // Asegurar que sortedPieces tenga un valor asignado
     });
    // Get Indicadores
    this.getMasEscaneos();
    this.getJuegosMasEscaneados();
    this.getEstadisticasJuegos();
    // Inicializar gráficos
    this.inicializarGráficos();
    // Actualizar el título de la página dinámicamente
    this.breadcrumbService.updateBreadcrumb('Indicadores', ['Inicio', 'Indicadores']);
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
        this.diferenciaEscaneos = parseFloat(this.diferenciaEscaneos.toFixed(0));    
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

  // Desplegables gráficos
  updateDesplegable(numero: number, option: string) {
  
    if (numero === 1) {
      this.opcionSeleccionada1 = option;
      sessionStorage.setItem('desplegableOption1', this.opcionSeleccionada1); // Guardar la opción seleccionada en sessionStorage
      if (option === "Uso motor gráfico") {
        this.getUsoMotorGráfico();
        this.valorOpcionSeleccionada1 = this.usoMotorGrafico;
      } else if (option === "Uso reproductor de audio") {
        this.getUsoAudio();
        this.valorOpcionSeleccionada1 = this.usoAudio;
      } else if (option === "Tiempo medio por sesión") {
        this.getTiempoMedioPorSesion();
        this.valorOpcionSeleccionada1 = this.tiempoSesion;
      } else if (option === "Juegos finalizados") {
        this.getEstadisticasJuegos();
        this.valorOpcionSeleccionada1 = this.juegos_finalizados;
      } else if (option == "Usuarios totales") {
        this.valorOpcionSeleccionada1 = this.totalUsuarios.toString();
      } else if (option == "Tiempo medio jugando") {
        this.getTiempoMedioPorJuego();
        this.valorOpcionSeleccionada1 = this.tiempoJuego;
      }
    } else if (numero === 2) {
      this.opcionSeleccionada2 = option;
      sessionStorage.setItem('desplegableOption2', this.opcionSeleccionada2); // Guardar la opción seleccionada en sessionStorage
      if (option === "Uso motor gráfico") {
        this.getUsoMotorGráfico();
        this.valorOpcionSeleccionada2 = this.usoMotorGrafico;
      } else if (option === "Uso reproductor de audio") {
        this.getUsoAudio();
        this.valorOpcionSeleccionada2 = this.usoAudio;
      } else if (option === "Tiempo medio por sesión") {
        this.getTiempoMedioPorSesion();
        this.valorOpcionSeleccionada2 = this.tiempoSesion;
      } else if (option === "Finalización juegos") {
        this.getEstadisticasJuegos();
        this.valorOpcionSeleccionada2 = this.juegos_finalizados;
      } else if (option == "Usuarios totales") {
        this.valorOpcionSeleccionada2 = this.totalUsuarios.toString();
      } else if (option == "Tiempo medio jugando") {
        this.getTiempoMedioPorJuego();
        this.valorOpcionSeleccionada2 = this.tiempoJuego;
      }
    }
  }  

  updateLista(numero: number, option: string) {
  
    if (numero === 1) {
      this.listaSeleccionada1 = option;
      sessionStorage.setItem('listaOption1', this.listaSeleccionada1); // Guardar la opción seleccionada en sessionStorage
      if (option === "Piezas más escaneadas") {
        this.valorlistaSeleccionada1 = this.sortedPieces;
      } else if (option === "Exposiciones con más escaneos") {
        this.valorlistaSeleccionada1 = this.sortedExposiciones;
      } else if (option === "Salas con más escaneos") {
        this.valorlistaSeleccionada1 = this.sortedSalas;
      } else if (option === "Juegos más jugados") {
        this.valorlistaSeleccionada1 = this.sortedJuegos;
      }
    } else if (numero === 2) {
      this.listaSeleccionada2 = option;
      sessionStorage.setItem('listaOption2', this.listaSeleccionada2); // Guardar la opción seleccionada en sessionStorage
      if (option === "Piezas más escaneadas") {
        this.valorlistaSeleccionada2 = this.sortedPieces;
      } else if (option === "Exposiciones con más escaneos") {
        this.valorlistaSeleccionada2 = this.sortedExposiciones;
      } else if (option === "Salas con más escaneos") {
        this.valorlistaSeleccionada2 = this.sortedSalas;
      } else if (option === "Juegos más jugados") {
        this.valorlistaSeleccionada2 = this.sortedJuegos;
      }
    } else if (numero === 3) {
      this.listaSeleccionada3 = option;
      sessionStorage.setItem('listaOption3', this.listaSeleccionada3); // Guardar la opción seleccionada en sessionStorage
      if (option === "Piezas más escaneadas") {
        this.valorlistaSeleccionada3 = this.sortedPieces;
      } else if (option === "Exposiciones con más escaneos") {
        this.valorlistaSeleccionada3 = this.sortedExposiciones;
      } else if (option === "Salas con más escaneos") {
        this.valorlistaSeleccionada3 = this.sortedSalas;
      } else if (option === "Juegos más jugados") {
        this.valorlistaSeleccionada3 = this.sortedJuegos;
      }
    }
  }  

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
                // Para la lista seleccionada 1
                if (this.listaSeleccionada1 === "Piezas más escaneadas" || 
                    this.listaSeleccionada1 === "Exposiciones con más escaneos" || 
                    this.listaSeleccionada1 === "Salas con más escaneos" || 
                    this.listaSeleccionada1 === "Juegos más jugados") {
                    this.updateLista(1, this.listaSeleccionada1);
                }

                // Para la lista seleccionada 2
                if (this.listaSeleccionada2 === "Piezas más escaneadas" || 
                    this.listaSeleccionada2 === "Exposiciones con más escaneos" || 
                    this.listaSeleccionada2 === "Salas con más escaneos" || 
                    this.listaSeleccionada2 === "Juegos más jugados") {
                    this.updateLista(2, this.listaSeleccionada2);
                }

                // Para la lista seleccionada 3
                if (this.listaSeleccionada3 === "Piezas más escaneadas" || 
                    this.listaSeleccionada3 === "Exposiciones con más escaneos" || 
                    this.listaSeleccionada3 === "Salas con más escaneos" || 
                    this.listaSeleccionada3 === "Juegos más jugados") {
                    this.updateLista(3, this.listaSeleccionada3);
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

  getEstadisticasJuegos() {
    let totalJuegosFinalizados = 0; // Variable local para almacenar el total de uso de motor gráfico
    this.escaneoService.getAllEscaneosJuegos().subscribe(data => {
      this.escaneos_juego = data;
      this.totalEscaneosJuego = data.length;
      for (let i = 0; i < this.escaneos_juego.length; i++) {
        if (this.escaneos_juego[i].finalizado == 1) {
          totalJuegosFinalizados++;
        }
      }
      this.juegos_finalizados = parseFloat((totalJuegosFinalizados / this.totalEscaneosJuego * 100).toFixed(2)).toString()+"%";
      if (this.opcionSeleccionada1 === "Juegos finalizados") {
        this.valorOpcionSeleccionada1 = this.juegos_finalizados;
      } else if (this.opcionSeleccionada2 === "Juegos finalizados") {
        this.valorOpcionSeleccionada2 = this.juegos_finalizados;
      }
    })
  }

  getUsuarios() {
    this.escaneoService.getIndicadorUsuarios().subscribe(data => {
      this.pieChartDataValues = data.values;
      this.pieChartDataNames = data.names;
      console.log(this.pieChartDataValues)
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
      if (this.opcionSeleccionada1 === "Uso motor gráfico") {
        this.valorOpcionSeleccionada1 = this.usoMotorGrafico;
      } else if (this.opcionSeleccionada2 === "Uso motor gráfico") {
        this.valorOpcionSeleccionada2 = this.usoMotorGrafico;
      }
    });
  }
  
  
  getUsoAudio() {
    let sumaEscaneos = 0; // Variable local para almacenar la suma de escaneos de audio
  
    this.escaneoService.getAllEscaneosPiezas().subscribe(data => {
      this.escaneos = data;
      this.totalEscaneos = data.length;
      
      for (let i = 0; i < this.escaneos.length; i++) {
        if (this.escaneos[i].audio == 1) {
          sumaEscaneos++;
        }
      }
  
      this.usoAudio = parseFloat((sumaEscaneos / this.totalEscaneos * 100).toFixed(2)).toString()+"%";
      if (this.opcionSeleccionada1 === "Uso reproductor de audio") {
        this.valorOpcionSeleccionada1 = this.usoAudio;
      } else if (this.opcionSeleccionada2 === "Uso reproductor de audio") {
        this.valorOpcionSeleccionada2 = this.usoAudio;
      }
    });
  }
  
  getTiempoMedioPorSesion() {
    let sumaTotalTiempo = 0; // Variable local para almacenar la suma total de tiempo de sesión
  
    this.escaneoService.getAllEscaneosPiezas().subscribe(data => {
      this.escaneos = data;
      this.totalEscaneos = data.length;
  
      for (let i = 0; i < this.escaneos.length; i++) {
        const tiempo = this.escaneos[i].tiempo;
        if (tiempo !== undefined && typeof tiempo === 'number') {
          sumaTotalTiempo += tiempo;
        }
      }
  
      let tiempoSesionEnSegundos = parseFloat((sumaTotalTiempo / this.totalEscaneos).toFixed(2));
      this.tiempoSesion = this.segundosAFormatoTiempo(tiempoSesionEnSegundos);
      if (this.opcionSeleccionada1 === "Tiempo medio por sesión") {
        this.valorOpcionSeleccionada1 = this.tiempoSesion;
      } else if (this.opcionSeleccionada2 === "Tiempo medio por sesión") {
        this.valorOpcionSeleccionada2 = this.tiempoSesion;
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
      if (this.opcionSeleccionada1 === "Tiempo medio jugando") {
        this.valorOpcionSeleccionada1 = this.tiempoJuego;
      } else if (this.opcionSeleccionada2 === "Tiempo medio jugando") {
        this.valorOpcionSeleccionada1 = this.tiempoJuego;
      }
    });
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
