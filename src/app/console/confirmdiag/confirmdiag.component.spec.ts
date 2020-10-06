import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmdiagComponent } from './confirmdiag.component';

describe('ConfirmdiagComponent', () => {
  let component: ConfirmdiagComponent;
  let fixture: ComponentFixture<ConfirmdiagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmdiagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmdiagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
