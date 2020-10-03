import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Project, Technologies } from '../../project';

@Component({
  selector: 'app-projectform',
  templateUrl: './projectform.component.html',
  styleUrls: ['./projectform.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectformComponent implements OnInit {

  @ViewChild('thumbnail') thumbnailImageBox: ElementRef<HTMLElement>;

  public images: Array<string | ArrayBuffer> = [];
  public techs = Technologies;
  

  projectForm = new FormGroup({
    thumbnail: new FormControl('', Validators.required),
    images: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    caption: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    technologies: new FormControl('', Validators.required),
    color: new FormControl('', Validators.required),
    projectlink: new FormControl(''),
    githublink: new FormControl(''),
  })

  constructor() { }

  ngOnInit(): void { }

  /**
   * Submits the project form
   */
  public submitForm() {
    console.log(this.projectForm.value);
  }

  /**
   * Displays the inputed image for the project thumbnail
   * 
   * @param event 
   *        The on change event fired from the file input
   */
  public displayThumbnail(event): void {

    this.projectForm.get('thumbnail').setErrors(null);                      //Set the thumbnail input element error to none
    const filereader = new FileReader();                                    //File reader for the thumbnail input

    const fileAsBlob: File = this.projectForm.controls.thumbnail.value;     //The file to read
    const file = fileAsBlob as Blob;                                    

    if (file == null) {
      this.projectForm.controls.thumbnail.setValue(null);
      this.thumbnailImageBox.nativeElement.style.backgroundImage = '';
      return;
    }

    if (!file.type.match('image.*')) {                                      //If the file is not of an image type, 
      event.target.value = null;                                            //set error and clear the input and return
      this.thumbnailImageBox.nativeElement.style.backgroundImage = '';
      this.projectForm.controls.thumbnail.setValue(null);
      this.projectForm.get('thumbnail').setErrors({'InvalidFile': true});
      return;
    }

    filereader.readAsDataURL(file);                        //read the image

    filereader.onload = () => {                                             //Set the thumbnail preview div background
      this.thumbnailImageBox.nativeElement.style.backgroundImage = 'url(' + filereader.result + ')';
    }
  }

  /**
   * Displays images of inputted files
   * 
   * @param event 
   *        The on change event fired from the file input
   */
  public displayImages(event): void {

    this.images = [];
    this.projectForm.get('images').setErrors(null);

    const files = this.projectForm.controls.images.value;                         //The files to read

    for (let file of files) {
      if (!file.type.match('image.*')) {                                          //If the file is not of an image type, 
        event.target.value = null;                                                //set error and clear the input and return
        this.projectForm.controls.images.setValue(null);
        this.images = [];
        this.projectForm.get('images').setErrors({'containsInvalidFiles': true});
        return;
      }
    }

    for (let file of files) {                                                     //set images to display
      let filereader = new FileReader();
      filereader.readAsDataURL(file);
      filereader.onload = () => {
        this.images.push(filereader.result);
      };
    }
  }

  /**
   * Returns the names of technologies from the projects Technologies enum
   * 
   * @returns
   *          Array<string>
   */
  public techKeys() : Array<string> {
    var keys = Object.keys(this.techs);
    return keys.slice(keys.length / 2);
  }

  /**
   * Returns the error for the thumbnail input
   * 
   * @returns
   *        string: error
   */
  public getThumbnailErrors(): string {
    if (this.projectForm.controls.thumbnail.errors.InvalidFile) {
      return 'The inputed file was not an image type!'
    } else if (this.projectForm.controls.thumbnail.errors.required) {
      return 'Please input an image'
    }
  }

  /**
   * Returns the error for the images input
   * 
   * @returns
   *        string: error
   */
  public getImagesErrors(): string {
    if (this.projectForm.controls.images.errors.containsInvalidFiles) {
      return 'An inputed file was not an image type!'
    } else if (this.projectForm.controls.images.errors.required) {
      return 'Please input at least one image'
    }
  }


}
