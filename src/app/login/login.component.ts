import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  public formError: string = '';     //displays login errors                                 

  loginForm = new FormGroup({       //login form inputs                                      
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private auth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
  }

  public submitForm(): void {
    
    //Set persistance
    this.auth.setPersistence('session').then(() => {

      //login
      this.auth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password).catch(() => {
        this.formError = 'The email or password is invalid';
      }).then((res) => {
        
        if (res) {
          this.formError = '';
          this.router.navigate(['/console']);
        }

      })
    });

  }

  /**
   * Returns the error for email input
   * 
   * @returns String: message of the error
   */
  public getEmailError(): String {
    if (this.loginForm.controls['email'].errors.required) {
      return "Please enter an email"
    } else if (this.loginForm.controls['email'].errors.email) {
      return "Please enter a valid email"
    }
  }

  /**
   * Returns the error for password input
   * 
   * @returns String: message of the error
   */
  public getPasswordError(): string {
    if (this.loginForm.controls['password'].errors.required) {
      return "Please enter a password"
    } 
  }

}
