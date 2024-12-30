import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
//import {self_engine} from './self_engine.service';
import { EngineService } from './self_engine.service';

@Component({
  selector: 'app-self-engine',
  standalone: true,
  imports: [],
  templateUrl: './self-engine.component.html',
  styleUrl: './self-engine.component.css'
})
export class SelfEngineComponent {

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;

  public constructor(private engServ: EngineService) {
  }

  public ngOnInit(): void {
    //this.engServ.createScene(this.rendererCanvas);
    this.engServ.createScene(this.rendererCanvas);
    //this.engServ.animate();
  }
}
