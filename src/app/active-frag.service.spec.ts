import { TestBed } from '@angular/core/testing';

import { ActiveFragService } from './active-frag.service';

describe('ActiveFragService', () => {
  let service: ActiveFragService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveFragService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
