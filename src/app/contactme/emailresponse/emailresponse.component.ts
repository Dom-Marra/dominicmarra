import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-emailresponse',
  templateUrl: './emailresponse.component.html',
  styleUrls: ['./emailresponse.component.scss']
})
export class EmailresponseComponent implements OnInit {

  public success: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) data) { 
    this.success = data['success'];
  }

  ngOnInit(): void {
  }

}
