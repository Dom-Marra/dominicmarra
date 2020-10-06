import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/project';
import { FirebaseService } from '../../firebase.service';

@Component({
  selector: 'app-addproject',
  templateUrl: './addproject.component.html',
  styleUrls: ['./addproject.component.scss']
})
export class AddprojectComponent implements OnInit {

  constructor(private firebase: FirebaseService) { }

  ngOnInit(): void {
  }

  /**
   * Adds project to the firestore
   * 
   * @param formValues
   *        Project: values passed from project form 
   */
  public add(formValues: Project) {
    this.firebase.addProject(formValues.projectObj).then(res => {
    });
  }

}
