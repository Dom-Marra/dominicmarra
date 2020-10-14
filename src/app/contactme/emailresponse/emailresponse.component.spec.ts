import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailresponseComponent } from './emailresponse.component';

describe('EmailresponseComponent', () => {
  let component: EmailresponseComponent;
  let fixture: ComponentFixture<EmailresponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailresponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailresponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
