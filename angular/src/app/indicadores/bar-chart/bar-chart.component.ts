import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})

export class BarChartComponent implements OnInit, OnChanges {

  @Input() barChartDataValues: any[] = []; // Atributo de entrada para los datos de las barras
  @Input() barChartDataNames: any[] = []; // Atributo de entrada para los datos de las barras
  @Input() barChartTitle: string = ''; // Título del gráfico
  mayorValor: number = 0;
  total: number = 0;
  labelMayorValor: string = '';
  media: number = 0;

  ngOnInit(): void {    
    this.generarBarChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['barChartDataValues'] && changes['barChartDataValues'].currentValue ||
        changes['barChartDataNames'] && changes['barChartDataNames'].currentValue) {
      this.generarBarChart();
    }
  }  

  generarBarChart() {
    var dom = document.getElementById('bar-chart-container');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });

    // Calcular el mayor valor
    this.mayorValor = Math.max(...this.barChartDataValues);
    const indiceMayorValor = this.barChartDataValues.indexOf(this.mayorValor);
    // Obtener el nombre correspondiente al mayor valor
    this.labelMayorValor = this.barChartDataNames[indiceMayorValor];
    // Calcular el total
    this.total = this.barChartDataValues.reduce((acc, val) => acc + val, 0);
    // Calcular la media
    this.media = this.total / this.barChartDataValues.length;
  
    var option = {
      title: {
        text: this.barChartTitle,
        textStyle: {
          fontSize: 13,
        },
        left: 'center', // Centrar el título horizontalmente
        top: '15px'
      },
      grid: {
        left: '2%',   // Ajusta el margen izquierdo del gráfico
        right: '2%',  // Ajusta el margen derecho del gráfico
        bottom: '20%',
        top: 50, // Dejar espacio para las columnas de texto debajo del gráfico
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: this.barChartDataNames
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: this.barChartDataValues,
          type: 'bar',
          itemStyle: {
            color: '#9C6644',
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 4
          },
          emphasis: {
            itemStyle: {
              color: '#E45E2D'
            }
          }
        }
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      // Agregar texto debajo del gráfico
      graphic: [
        {
          type: 'text',
          left: '20%',
          top: '92%',
          style: {
            text: `Total`,
            fontSize: 12,
            fill: '#A1AAB2'
          }
        },
        {
          type: 'text',
          left: '20%',
          top: '85%',
          style: {
            text: `${this.total}`,
            fontSize: 16,
            fill: '#000000'
          }
        },
        {
          type: 'text',
          left: 'center',
          top: '92%',
          style: {
            text: `Mayor valor`,
            fontSize: 12,
            fill: '#A1AAB2'
          }
        },
        {
          type: 'text',
          left: 'center',
          top: '85%',
          style: {
            text: `${this.mayorValor} (${this.labelMayorValor})`,
            fontSize: 16,
            fill: '#000000'
          }
        },
        {
          type: 'text',
          right: '15%',
          top: '92%',
          style: {
            text: `Media`,
            fontSize: 12,
            fill: '#A1AAB2'
          }
        },
        {
          type: 'text',
          right: '15%',
          top: '85%',
          style: {
            text: `${this.media.toFixed(2)}`,
            fontSize: 16,
            fill: '#000000'
          }
        }
      ]

    };
  
    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
  }
  
}

