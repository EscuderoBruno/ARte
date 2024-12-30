import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEngineComponent } from './self-engine.component';

describe('SelfEngineComponent', () => {
  let component: SelfEngineComponent;
  let fixture: ComponentFixture<SelfEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfEngineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelfEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

export { SelfEngineComponent };
