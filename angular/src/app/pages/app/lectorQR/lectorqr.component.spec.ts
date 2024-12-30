import { ComponentFixture, TestBed } from '@angular/core/testing';
import { lectorqrComponent } from './lectorqr.component';

describe('LectorqrComponent', () => {
  let component: lectorqrComponent;
  let fixture: ComponentFixture<lectorqrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [lectorqrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(lectorqrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
