import { TestBed, inject } from '@angular/core/testing';

import { RadiosService } from './radios.service';

describe('RadiosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RadiosService]
    });
  });

  it('should be created', inject([RadiosService], (service: RadiosService) => {
    expect(service).toBeTruthy();
  }));
});
