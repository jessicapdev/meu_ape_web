/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EmpreendimentoService } from './empreendimento.service';

describe('Service: Empreendimento', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmpreendimentoService]
    });
  });

  it('should ...', inject([EmpreendimentoService], (service: EmpreendimentoService) => {
    expect(service).toBeTruthy();
  }));
});
