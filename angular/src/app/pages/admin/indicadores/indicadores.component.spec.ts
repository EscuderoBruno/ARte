import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresComponent } from './indicadores.component';

describe('IndicadoresComponent', () => {
  let component: IndicadoresComponent;
  let fixture: ComponentFixture<IndicadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicadoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndicadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
