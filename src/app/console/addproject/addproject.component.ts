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

  public add(formValues: Project) {
    this.firebase.addProject(formValues.projectObj).then(res => {
      console.log(res);
    });
  }

}
