import { TestBed } from '@angular/core/testing';

import { UrlSyncService } from './url-sync.service';

describe('UrlSyncService', () => {
  let service: UrlSyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlSyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
