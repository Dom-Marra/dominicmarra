import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-contactme',
  templateUrl: './contactme.component.html',
  styleUrls: ['./contactme.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactmeComponent implements OnInit {

  contactForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    subject: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  constructor() { }

  ngOnInit(): void {
    
  }

  public submitForm(): void {
    console.log(this.contactForm.value);
  }

  public getEmailError(): String {
    if (this.contactForm.controls['email'].errors.required) {
      return "Please enter an email"
    } else if (this.contactForm.controls['email'].errors.email) {
      return "Please enter a valid email"
    }
  }

  public getSubjectError(): String { 
    if (this.contactForm.controls['subject'].errors.required) {
      return "Please enter a subject"
    }
  }

  public getDescriptionError(): String { 
    if (this.contactForm.controls['description'].errors.required) {
      return "Please enter a description"
    }
  }

}
