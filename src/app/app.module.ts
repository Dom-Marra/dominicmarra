import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

//Angular Material Modules
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

//Extra angular material modules
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, MatColorFormats } from '@angular-material-components/color-picker'

//Extras
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from "@angular/material/dialog";
import { SimplebarAngularModule } from 'simplebar-angular';
import { QuillModule } from 'ngx-quill';

//Firebase Modules
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';

//App components
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ProjectcardComponent } from './projectcard/projectcard.component';
import { ProjectcarouselComponent } from './projectcarousel/projectcarousel.component';
import { ProjectcardDetailsComponent } from './projectcard-details/projectcard-details.component';
import { ContactmeComponent } from './contactme/contactme.component';
import { FooterComponent } from './footer/footer.component';
import { ActiveFragmentDirective } from './active-fragment.directive';
import { LoginComponent } from './login/login.component';
import { ConsoleComponent } from './console/console.component';
import { AddprojectComponent } from './console/addproject/addproject.component';
import { UpdateprojectComponent } from './console/updateproject/updateproject.component';
import { DeleteprojectComponent } from './console/deleteproject/deleteproject.component';
import { ProjectformComponent } from './console/projectform/projectform.component';

export const CUSTOM_MAT_COLOR_FORMATS: MatColorFormats = {
  display: {
      colorInput: 'hex'
  }
}

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
    ActiveFragmentDirective,
    LoginComponent,
    ConsoleComponent,
    AddprojectComponent,
    UpdateprojectComponent,
    DeleteprojectComponent,
    ProjectformComponent
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
    MatButtonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    MatSelectModule,
    NgxMatFileInputModule,
    NgxMatColorPickerModule,
    QuillModule.forRoot()
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: CUSTOM_MAT_COLOR_FORMATS }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ProjectcardDetailsComponent]
})
export class AppModule { }
