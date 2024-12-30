import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbService } from '../../../commons/admin/breadcrumb/breadcrumb.service'
import { PieceService } from '../piezas/pieza-servicio.service';
import { SalaService } from '../salas/sala-servicio.service';

import * as echarts from 'echarts';

@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrl: './indicadores.component.css'
})
export class IndicadoresComponent {

  pieces: any[] = [];
  salas: any[] = [];

  constructor(private pieceService: PieceService, 
              private salaService: SalaService, 
              private breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    // Obtener todas las piezas
    this.pieceService.getAll().subscribe(data => {
      this.pieces = data;
    });
    // Obtener todas las salas
    this.salaService.getAll().subscribe(data => {
      this.salas = data;
    });
    // Actualizar el título de la página dinámicamente
    this.breadcrumbService.updateBreadcrumb('Indicadores', ['Inicio', 'Indicadores']);

    this.generarBarChart();
  }

  generarBarChart() {

    var dom = document.getElementById('chart-container');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var app = {};
    var option;
    
    option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }
      ]
    };
    
    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
  }

}
