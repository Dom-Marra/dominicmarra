import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectcarouselComponent } from './projectcarousel.component';

describe('ProjectcarouselComponent', () => {
  let component: ProjectcarouselComponent;
  let fixture: ComponentFixture<ProjectcarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectcarouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectcarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
