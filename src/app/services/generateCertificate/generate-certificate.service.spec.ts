import { TestBed } from '@angular/core/testing';

import { GenerateCertificateService } from './generate-certificate.service';

describe('GenerateCertificateService', () => {
  let service: GenerateCertificateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateCertificateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
