import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';

type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'app-pie-chart2',
  templateUrl: './pie-chart2.component.html',
  styleUrls: ['./pie-chart2.component.css']
})
export class PieChartComponent2 implements OnInit {
  @Input() pieChartDataValues2: any[] = []; // Datos de ejemplo para las barras
  @Input() pieChartDataNames2: any[] = []; // Nombres de los datos para las barras

  ngOnInit(): void {
    this.generarPieChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pieChartDataValues2'] && changes['pieChartDataValues2'].currentValue ||
        changes['pieChartDataNames2'] && changes['pieChartDataNames2'].currentValue) {
      this.generarPieChart();
    }
  }  

  generarPieChart() {
    if (!this.pieChartDataValues2 || !this.pieChartDataNames2 || this.pieChartDataValues2.length === 0 || this.pieChartDataNames2.length === 0) {
      return;
    }

    var dom = document.getElementById('pie-chart-container2');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
  
    var option: EChartsOption;

    // Definir una matriz de colores
    var colors = ['#9C6644', '#DDB892', '#BE8A66', '#e9d2c0'];
    
    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'right'
      },
      series: [
        {
          name: 'Total',
          type: 'pie',
          radius: '80%',
          label: {
            show: false,
            formatter: '{d}%', // Muestra el porcentaje en las etiquetas
            position: 'outside', // Coloca las etiquetas fuera del pie chart
            fontSize: 14
          },
          data: this.pieChartDataValues2.map((value, index) => ({
            value,
            name: this.pieChartDataNames2[index],
            itemStyle: { color: colors[index % colors.length], shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 4 }
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  
    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
  }
}
