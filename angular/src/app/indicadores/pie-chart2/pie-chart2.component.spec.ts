import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartComponent2 } from './pie-chart2.component';

describe('BarChartComponent', () => {
  let component: PieChartComponent2;
  let fixture: ComponentFixture<PieChartComponent2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartComponent2]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PieChartComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
