import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectselectComponent } from './projectselect.component';

describe('ProjectselectComponent', () => {
  let component: ProjectselectComponent;
  let fixture: ComponentFixture<ProjectselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectselectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
