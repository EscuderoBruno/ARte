import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';

type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  ngOnInit(): void {
    this.generarPieChart();
  }

  generarPieChart() {
    var dom = document.getElementById('pie-chart-container');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
  
    var option: EChartsOption;
    
    option = {
      title: {
        left: 'center',
        top: '3%',
        textStyle: {
          fontWeight: 'bold',
          fontSize: 16,
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)' // Aquí se muestra el porcentaje
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      grid: {
        left: '10%',   // Ajusta los márgenes izquierdo y derecho
        right: '10%',
        top: '10%',    // Ajusta los márgenes superior e inferior
        bottom: '10%',
        containLabel: true
      },
      series: [
        {
          name: 'Total',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            borderRadius: 10,
          },
          label: {
            show: false,
            formatter: '{d}%', // Muestra el porcentaje en las etiquetas
            position: 'outside', // Coloca las etiquetas fuera del pie chart
            fontSize: 14
          },
          emphasis: {
            label: {
              show: false,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 1230, name: 'Adultos', itemStyle: { color: '#E45E2D', shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 4 } }, // Cambio de color para adultos
            { value: 672, name: 'Niños', itemStyle: { color: '#FBDB68', shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 4 } },    // Cambio de color para niños
          ]
        }
      ]
    };
  
    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
  }
}
