import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
  HostListener,
} from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {
  ScannerQRCodeConfig,
  NgxScannerQrcodeComponent,
  ScannerQRCodeResult,
} from 'ngx-scanner-qrcode';
import { io } from 'socket.io-client';
import { Juego, JuegoService } from '../../admin/juegos/juego-servicio.service';
import {
  escaneoJuego,
  escaneoService,
  Usuario,
} from '../../../services/escaneo.service';
import { environment } from '../../../../environments/environment';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';

declare var $: any;

interface Message {
  transmitter: string;
  content: string;
  buttons?: BotButton[];
  datetime: Date;
}

interface BotButton {
  content_type: string;
  title: string;
  payload: string;
}

@Component({
  selector: 'app-niños',
  templateUrl: './niños.component.html',
  styleUrls: ['./niños.component.css', '../app-style.css'],
})
export class AppNiñosComponent implements OnInit {
  html5QrcodeScanner: any;

  selectedSlide: number = 0;
  juego!: Juego;
  apiUrl: string = environment.apiURL;

  id = '';
  tiempoJuego = 0;

  escaneo: escaneoJuego | null = null;
  total_piezas = 0;
  finalizado: Number = 0;
  tiempo = 0;
  timer: any;
  isTimerRunning: boolean = false;

  //socket = io('http://localhost:5005');
  socket = io('https://8ccc5ef49711f6698596e71d2d201be6.serveo.net');
  newMessage: HTMLElement | null = document.getElementById('msg_1');
  leerQR = false;

  messages: Message[] = [
    // {
    //   transmitter: 'chatbot',
    //   content: 'Hola, pequeño explorador! Soy ALCUDIO, tu guía en la sala del museo de La Alcudia ¿Cómo te llamas?',
    //   datetime: new Date
    // }
  ];

  messagesCola: Message[] = [];
  escribiendo = false;

  userContent = new FormControl('');
  datosCargados = false;

  qrEscaner!: Html5Qrcode;
  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth,
      },
    },
    // canvasStyles: [
    //   { /* layer */
    //     lineWidth: 1,
    //     fillStyle: '#00950685',
    //     strokeStyle: '#00950685',
    //   },
    //   { /* text */
    //     font: '17px serif',
    //     fillStyle: '#ff0000',
    //     strokeStyle: '#ff0000',
    //   }
    // ],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private juegoService: JuegoService,
    private escaneoService: escaneoService
  ) {
    // Llamar al método que se ejecutará cada 10 segundos
    this.startTimer();
    // Llamar al método que registra al usuario al cargar la página
    this.registrarUsuario();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    // Verificar si la acción ya ha sido realizada utilizando sessionStorage

    setInterval(() => {
      this.tiempoJuego += 1;
    }, 1000);

    this.qrEscaner = new Html5Qrcode('reader');

    this.juegoService.getOne(this.id).subscribe((data) => {
      console.log(data);
      this.juego = data;
      this.datosCargados = true;
    });

    this.socket.on('bot_uttered', (response) => {
      console.log(response);
      this.botResponse(response);
    });

    this.socket.emit('user_uttered', {
      message: 'quiero jugar al juego ' + this.id,
    });

    $('#modalVerQR').on('shown.bs.modal', (e: any) => {
      console.log('Modal abierto');
      this.startScanner().then(() => {
        console.log('Escaner iniciado');
      });
    });

    $('#modalVerQR').on('hidden.bs.modal', (e: any) => {
      console.log('Modal cerrado');
      this.stopScanner().then(() => {
        console.log('Escaner apagado');
      });
    });

    this.escaneoService
      .createNewEscaneosJuego({
        juego_id: this.id,
        finalizado: this.finalizado,
        total_piezas: this.total_piezas,
        // total_piezas:
      })
      .subscribe((data: escaneoJuego) => {
        console.log(data);
        this.escaneo = data;
      });
  }

  sendMessage(evt: Event) {
    evt.preventDefault();
    if (this.userContent.value) {
      this.sendMsg(this.userContent.value);
      this.userContent.setValue('');
    }
  }

  sendMsg(response: any, msgAbove?: string) {
    console.log(response);
    this.messages.map((msg) => {
      msg.buttons = undefined;
    });
    this.bajarChat();
    const message: string = response.text || response;
    const buttons: BotButton[] = response.quick_replies;
    console.log(message, msgAbove);
    this.socket.emit('user_uttered', {
      message: message,
    });
    this.messages.push({
      transmitter: 'user',
      content: msgAbove || message,
      buttons: buttons,
      datetime: new Date(),
    });
  }

  clickBtn(response: any, msgIndex: number) {
    // if (response.text === 'Quiero ver los resultados') {
    //   this.router.navigate(['alcudio/resultados']);
    // }
    this.sendMsg(response);
  }

  bajarChat() {
    setTimeout(() => {
      const scrollContainer = document.getElementById('scroll-chat');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }, 0);
  }

  botResponse(response: any) {
    const text = response.text;
    if (text.startsWith('Command: ')) {
      console.log(text.substring(9));
      switch (text.substring(9)) {
        case 'acierto':
          document
            .getElementById(`step-${this.selectedSlide}`)
            ?.classList.add('acierto');
          document
            .getElementById(`step-${this.selectedSlide}`)
            ?.classList.remove('fallo');
          break;
        case 'fallo':
          document
            .getElementById(`step-${this.selectedSlide}`)
            ?.classList.add('fallo');
          document
            .getElementById(`step-${this.selectedSlide}`)
            ?.classList.remove('acierto');
          break;
        case 'siguiente':
          if (
            !document
              .getElementById(`step-${this.selectedSlide}`)
              ?.classList.contains('acierto')
          ) {
            document
              .getElementById(`step-${this.selectedSlide}`)
              ?.classList.add('fallo');
          }
          this.selectedSlide++;
          break;
        case 'localizar_pieza':
          document.getElementById('pieza-imagen')?.click();
          break;
        case 'final':
          this.selectedSlide = this.juego.Pregunta.length - 1;
          document.querySelectorAll('.num').forEach((_step) => {
            console.log(_step, !_step.classList.contains('acierto'));
            if (!_step.classList.contains('acierto')) {
              _step.classList.add('fallo');
            }
          });
          break;
        case 'resultados':
          setTimeout(() => {
            localStorage.setItem('tiempoJuego', this.tiempoJuego.toString());
            localStorage.setItem(
              'puntosJuego',
              document.querySelectorAll('.acierto').length.toString()
            );
            this.finalizado = 1;
            if (this.escaneo && this.escaneo.tiempo !== undefined) {
              this.escaneoService
                .editarEscaneosJuego(this.escaneo.id, {
                  tiempo: this.tiempo,
                  finalizado: this.finalizado,
                  total_piezas: document.querySelectorAll('.acierto').length,
                })
                .subscribe((data: escaneoJuego) => {
                  //console.log(data);
                });
            }
            this.router.navigate([`alcudio/resultados/${this.id}`]);
          }, 4000);
          break;
        default:
          break;
      }
    } else {
      const buttons: BotButton[] = response.quick_replies;
      this.messagesCola.push({
        transmitter: 'chatbot',
        content: text,
        buttons: buttons,
        datetime: new Date(),
      });
      setTimeout(() => {
        const msgCount = this.messagesCola.length;
        console.log(msgCount);
        this.messagesCola.forEach((_msg, i) => {
          this.escribiendo = true;
          setTimeout(() => {
            this.messages.push(_msg);
            this.bajarChat();
            this.escribiendo = false;
            if (msgCount > i + 1) {
              setTimeout(() => {
                this.escribiendo = true;
                this.bajarChat();
              }, 700);
            }
          }, 2000 * (i + 1));
        });
        this.messagesCola = [];
      }, 100);
    }
  }

  async startScanner() {
    try {
      this.qrEscaner
        .start(
          { facingMode: 'environment' },
          {
            fps: 10, // Optional, frame per seconds for qr code scanning
            qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
          },
          (decodedText, decodedResult) => {
            console.log(decodedText);
            const url = decodedText.split('/');
            const pieza_id = url[url.length - 2];
            if (pieza_id) {
              this.sendMsg(
                { text: 'La solucion es ' + pieza_id },
                '¡He encontrado la pieza!'
              );
              this.stopScanner();
              document.getElementById('closeModalQR')?.click();
            }
          },
          (errorMessage) => {
            // console.error(errorMessage);
          }
        )
        .catch((err) => {
          console.error('Error starting QR Code scanner: ', err);
        });
    } catch (err) {
      console.error('Error starting QR Code scanner: ', err);
    }
  }

  async stopScanner() {
    if (this.qrEscaner) {
      await this.qrEscaner.stop();
    }
  }

  // public onEvent(e: ScannerQRCodeResult[], action?: any): void {
  //   // e && action && action.pause();

  //   //location.href = e[0].value;
  //   const url = e[0].value.split('/');
  //   const pieza_id = url[url.length - 2];
  //   if (pieza_id) {
  //     this.sendMsg(
  //       { text: 'La solucion es ' + pieza_id },
  //       '¡He encontrado la pieza!'
  //     );
  //     this.action.stop();
  //     document.getElementById('closeModalQR')?.click();
  //     return;
  //   }
  // }

  // Indicadores

  // Método que se ejecuta cada 10 segundos
  startTimer() {
    if (!this.isTimerRunning) {
      this.isTimerRunning = true;
      this.timer = setInterval(() => {
        this.tiempo += 5;
        // Aquí colocas el código que quieres que se ejecute cada 10 segundos
        if (this.escaneo && this.escaneo.tiempo !== undefined) {
          this.escaneoService
            .editarEscaneosJuego(this.escaneo.id, {
              tiempo: this.tiempo,
              finalizado: this.finalizado,
            })
            .subscribe((data: escaneoJuego) => {
              //console.log(data);
            });
        }
      }, 5000); // 10000 milisegundos son 10 segundos
    }
  }

  stopTimer() {
    clearInterval(this.timer);
    this.isTimerRunning = false;
  }

  @HostListener('window:focus')
  onFocus(): void {
    this.startTimer();
  }

  @HostListener('window:blur')
  onBlur(): void {
    this.stopTimer();
  }

  registrarUsuario() {
    // Verificar si el usuario ya está registrado en localStorage
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    if (usuarioRegistrado !== null) {
      return; // Salir del método si el usuario ya está registrado
    }
    console.log('Creando usuario');
    this.escaneoService.createNewUsuarioNino().subscribe((data: Usuario) => {
      console.log(data);
      this.escaneo = data;

      // Marcar al usuario como registrado en localStorage
      localStorage.setItem('usuarioRegistrado', 'true');
    });
  }
}
