import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild, inject} from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScannerQRCodeConfig, NgxScannerQrcodeComponent, ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { io } from "socket.io-client";

interface Message {
  transmitter: string;
  content: string;
  datetime: Date;
}

@Component({
  selector: 'app-niños',
  templateUrl: './niños.component.html',
  styleUrls: ['./niños.component.css', '../../app-style.css']
})


export class AppNiñosComponent implements OnInit, AfterViewInit {

  socket = io("http://localhost:5005");
  newMessage: HTMLElement | null = document.getElementById('msg_1');
  leerQR = false;

  private modalService = inject(NgbModal);


  messages: Message[] = [
    {
      transmitter: 'chatbot',
      content: 'Hola, pequeño explorador! Soy ALCUDIO, tu guía en la sala del museo de La Alcudia ¿Cómo te llamas?',
      datetime: new Date
    }

  ]

  userContent = new FormControl('');

  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth
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
  @ViewChild('action') action!: NgxScannerQrcodeComponent;

  constructor() {}

  ngOnInit(): void {
    this.socket.on('bot_uttered', response => {
      this.botResponse(response.text);
    });
  }

  sendMessage(evt: Event){
    evt.preventDefault();
    if(this.userContent === null || this.userContent.value === ''){
      return;
    }
    this.socket.emit('user_uttered', {
      "message": this.userContent.value || '',
    });
    this.messages.push({
      transmitter: 'user',
      content: this.userContent.value || '',
      datetime: new Date
    })
    this.userContent.setValue('');

    // Este codigo mueve la camara hacia el mensaje, pero no funciona bien
    this.newMessage = document.getElementById('msg_' + (this.messages.length - 2));
    if(this.newMessage){
      this.newMessage.scrollIntoView({behavior: 'smooth'});
    }
  }

  botResponse(response: string){
    this.messages.push({
      transmitter: 'chatbot',
      content: response,
      datetime: new Date
    })
  }

  ngAfterViewInit(): void {
    this.action.isReady.subscribe((res: any) => {
      // this.handle(this.action, 'start');
    });
  }

  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    // e && action && action.pause();

    location.href = e[0].value;
    
  }

  public handle(action: any, fn: string): void {
    this.leerQR = true;
    const playDeviceFacingBack = (devices: any[]) => {
      // front camera or back camera check here!
      const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    }

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
    } else {
      action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
  }

}
