import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wildcard404 } from './wildcard-404';

describe('Wildcard404', () => {
  let component: Wildcard404;
  let fixture: ComponentFixture<Wildcard404>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Wildcard404]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Wildcard404);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
