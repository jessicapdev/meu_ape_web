/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { JwtHelperService } from './jwt-helper.service';

describe('Service: JwtHelper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JwtHelperService]
    });
  });

  it('should ...', inject([JwtHelperService], (service: JwtHelperService) => {
    expect(service).toBeTruthy();
  }));
});
