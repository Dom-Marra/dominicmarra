import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Project, ProjectObject } from 'src/app/project';
import { FirebaseService } from '../../firebase.service';

interface projectData {
  docId: string,
  project: Project
}

@Component({
  selector: 'app-projectselect',
  templateUrl: './projectselect.component.html',
  styleUrls: ['./projectselect.component.scss']
})

export class ProjectselectComponent implements OnInit {

  @Output() projectIdEmmitted = new EventEmitter<string>();   //Event emmiter to push the project id

  public projects: Array<projectData> = [];                   //stores project doc data

  constructor(private firebase: FirebaseService) { 
    this.firebase.readAllDocuments().subscribe(projs => {     //get observable of all projects
      this.projects = [];                                     //re-init projects

      projs.forEach(proj => {                                 //create a project data for each project
        let projectData: projectData = {
          docId: proj.id,
          project: new Project(<ProjectObject> proj.data()),
        }

        this.projects.push(projectData);                      //push project data
      })
    })
  }

  ngOnInit(): void {

  }

  /**
   * Emmits the project Id when one is selected
   * 
   * @param id
   *        String: doc id 
   */
  public emmitProjId(id: string) {
    this.projectIdEmmitted.emit(id);
  }

}
