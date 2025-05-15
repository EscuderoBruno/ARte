import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';

type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  @Input() pieChartDataValues: any[] = []; // Datos de ejemplo para las barras
  @Input() pieChartDataNames: any[] = []; // Nombres de los datos para las barras

  ngOnInit(): void {
    this.generarPieChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pieChartDataValues'] && changes['pieChartDataValues'].currentValue ||
        changes['pieChartDataNames'] && changes['pieChartDataNames'].currentValue) {
      this.generarPieChart();
    }
  }  

  generarPieChart() {
    if (!this.pieChartDataValues || !this.pieChartDataNames || this.pieChartDataValues.length === 0 || this.pieChartDataNames.length === 0) {
      return;
    }

    var dom = document.getElementById('pie-chart-container');
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
          data: this.pieChartDataValues.map((value, index) => ({
            value,
            name: this.pieChartDataNames[index],
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
