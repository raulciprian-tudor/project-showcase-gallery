import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { projectGuard } from './project.guard';

describe('projectGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => projectGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
