import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectcardDetailsComponent } from './projectcard-details.component';

describe('ProjectcardDetailsComponent', () => {
  let component: ProjectcardDetailsComponent;
  let fixture: ComponentFixture<ProjectcardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectcardDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectcardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
