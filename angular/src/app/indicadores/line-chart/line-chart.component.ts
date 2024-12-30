import { Component } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent {

  ngOnInit(): void {    
    this.generarLineChart();
  }

  generarLineChart() {
    var dom = document.getElementById('line-chart-container');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false,
    });
  
    var option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [420, 932, 601, 934, 990, 1330, 820],
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#8B412B', // Color de la línea
            shadowColor: 'rgba(0, 0, 0, 0.5)', // Color de la sombra
            shadowBlur: 4 // Intensidad de la sombra
          },
          itemStyle: {
            color: '#8B412B', // Color de los puntos
            shadowColor: 'rgba(0, 0, 0, 0.5)', // Color de la sombra
            shadowBlur: 4 // Intensidad de la sombra
          },
          tooltip: { // Configurar tooltip para mostrar valor al pasar el ratón sobre el punto
            show: true, // Mostrar el tooltip
            trigger: 'axis', // Activar tooltip al pasar el ratón sobre el eje
            formatter: '{b}: {c}' // Mostrar el nombre del día y el valor del punto
          }
        }
      ]
    };
    
    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
  }
}
