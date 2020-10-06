import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/firebase.service';
import { ConfirmdiagComponent } from '../confirmdiag/confirmdiag.component';

@Component({
  selector: 'app-deleteproject',
  templateUrl: './deleteproject.component.html',
  styleUrls: ['./deleteproject.component.scss']
})
export class DeleteprojectComponent implements OnInit {

  constructor(private firebase: FirebaseService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  /**
   * Deletea project from the firestore
   * 
   * @param id 
   *        String: id of the project in the firestore
   */
  public delete(id: string) {
    const dialogConfig = new MatDialogConfig();         //confirmation dialog config
    dialogConfig.disableClose = true;                   //dont allow closing on escape or clicking backdrop
    
    dialogConfig.data = { title: 'Confirm Deletion',    //set title, message, and action text
                          message: 'Are you sure you want to delete this project? Once confirmed it cannot be canceled or undone!', 
                          action: 'Delete' };

    let diagRef = this.dialog.open(ConfirmdiagComponent, dialogConfig);     //open the diag and create the reference to it

    diagRef.afterClosed().toPromise().then((results: Boolean) => {          //Delete the project if confirmed
      if (results) {
        this.firebase.deleteProject(id);
      }
    });
    
  }

}
