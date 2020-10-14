import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EmailresponseComponent } from './emailresponse/emailresponse.component';

@Component({
  selector: 'app-contactme',
  templateUrl: './contactme.component.html',
  styleUrls: ['./contactme.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactmeComponent implements OnInit {
  
  @ViewChild('formDirective') private formDirective: NgForm;  //used for resetting the form without erros

  contactForm = new FormGroup({                                             //contact form values
    email: new FormControl('', [Validators.email, Validators.required]),
    subject: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  ngOnInit(): void {
    
  }

  /**
   * Submits the contact form
   */
  public submitForm(): void { 
    this.contactForm.disable();

    this.http.post("https://us-central1-dominicmarra-95b72.cloudfunctions.net/sendEmail", JSON.stringify(this.contactForm.value)).subscribe(value => {
      this.contactForm.enable();

      const dialogConfig = new MatDialogConfig();         //confirmation dialog config
      
      dialogConfig.data = { success: value };

      if (value) {
        this.contactForm.reset('');
        this.formDirective.resetForm('');
      } 

      this.dialog.open(EmailresponseComponent, dialogConfig);     //open the diag and create the reference to it
    })
  }

  /**
   * Returns the error for email input
   * 
   * @returns String: message of the error
   */
  public getEmailError(): String {
    if (this.contactForm.controls['email'].errors.required) {
      return "Please enter an email"
    } else if (this.contactForm.controls['email'].errors.email) {
      return "Please enter a valid email"
    }
  }

  /**
   * Returns the error for subject input
   * 
   * @returns String: message of the error
   */
  public getSubjectError(): String { 
    if (this.contactForm.controls['subject'].errors.required) {
      return "Please enter a subject"
    }
  }

  /**
   * Returns the error for description input
   * 
   * @returns String: message of the error
   */
  public getDescriptionError(): String { 
    if (this.contactForm.controls['description'].errors.required) {
      return "Please enter a description"
    }
  }

}
