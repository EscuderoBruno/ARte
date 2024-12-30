import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiezasSalaComponent } from './piezas-sala.component';

describe('PiezasSalaComponent', () => {
  let component: PiezasSalaComponent;
  let fixture: ComponentFixture<PiezasSalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiezasSalaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PiezasSalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
