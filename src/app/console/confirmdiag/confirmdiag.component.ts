import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-confirmdiag',
  templateUrl: './confirmdiag.component.html',
  styleUrls: ['./confirmdiag.component.scss']
})
export class ConfirmdiagComponent implements OnInit {
  public title: string = '';
  public message: string = '';
  public action: string = '';
  
  constructor(private dialogRef: MatDialogRef<ConfirmdiagComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.title = data['title'];
    this.message = data['message'];
    this.action = data['action'];
  }

  ngOnInit(): void {

  }

}
