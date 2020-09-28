import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from "@angular/material/dialog";
import { SimplebarAngularModule } from 'simplebar-angular';

import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ProjectcardComponent } from './projectcard/projectcard.component';
import { ProjectcarouselComponent } from './projectcarousel/projectcarousel.component';
import { ProjectcardDetailsComponent } from './projectcard-details/projectcard-details.component';
import { ContactmeComponent } from './contactme/contactme.component';
import { FooterComponent } from './footer/footer.component';
import { ActiveFragmentDirective } from './active-fragment.directive';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProjectcardComponent,
    ProjectcarouselComponent,
    ProjectcardDetailsComponent,
    ContactmeComponent,
    FooterComponent,
    ActiveFragmentDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MatDialogModule,
    SimplebarAngularModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
  entryComponents: [ProjectcardDetailsComponent]
})
export class AppModule { }
