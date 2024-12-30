import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';

@Component({
  selector: 'app-lectorqr',
  templateUrl: './lectorqr.component.html',
  styleUrls: ['./lectorqr.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LectorqrComponent implements OnInit {

  @ViewChild(QrScannerComponent) qrScannerComponent!: QrScannerComponent;

  ngOnInit() {
    if (this.qrScannerComponent) {
      this.qrScannerComponent.getMediaDevices().then(devices => {
        console.log(devices);
        const videoDevices: MediaDeviceInfo[] = [];
        for (const device of devices) {
          if (device.kind.toString() === 'videoinput') {
            videoDevices.push(device);
          }
        }
        // Resto del código...
      });
    }
  }
}
