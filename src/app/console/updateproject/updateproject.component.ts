import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/firebase.service';
import { ConfirmdiagComponent } from '../confirmdiag/confirmdiag.component';
import { Project } from 'src/app/project';

@Component({
  selector: 'app-updateproject',
  templateUrl: './updateproject.component.html',
  styleUrls: ['./updateproject.component.scss']
})
export class UpdateprojectComponent implements OnInit {

  public project: Project;                            //Selected project to modify
  private projectId: string;

  constructor(private firebase: FirebaseService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  /**
   * Select the project to modify
   * 
   * @param id 
   *        String: doc id
   */
  public selectProject(id: string) {
    this.projectId = id;
    this.firebase.readProject(id).then(proj => {
      this.project = new Project(proj.data());
    })
  }

  /**
   * Updates the project in the firestore 
   * 
   * @param project 
   *               Project data to use
   */
  public update(project: Project) {

    const dialogConfig = new MatDialogConfig();         //confirmation dialog config
    dialogConfig.disableClose = true;                   //dont allow closing on escape or clicking backdrop
    
    dialogConfig.data = { title: 'Confirm Modification',    //set title, message, and action text
                          message: 'Are you sure you want to modify this project? Once confirmed it cannot be canceled or undone!', 
                          action: 'Modify' };

    let diagRef = this.dialog.open(ConfirmdiagComponent, dialogConfig);     //open the diag and create the reference to it

    diagRef.afterClosed().toPromise().then((results: Boolean) => {          //Delete the project if confirmed
      this.firebase.updateDoc(this.projectId, project.projectObj, this.project.projectObj);
    });
  }

}
