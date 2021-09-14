import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarCertificadoComponent } from './generar-certificado.component';

describe('GenerarCertificadoComponent', () => {
  let component: GenerarCertificadoComponent;
  let fixture: ComponentFixture<GenerarCertificadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarCertificadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarCertificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
