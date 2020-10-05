import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Project, Technologies } from '../../project';
import { FirebaseService } from '../../firebase.service';

@Component({
  selector: 'app-projectform',
  templateUrl: './projectform.component.html',
  styleUrls: ['./projectform.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProjectformComponent implements OnInit {

  @Output() projectFormEmitted = new EventEmitter<Project>();   //Event emmiter to push the project on form submit

  @Input() project: Project;                                    //project to use during modification

  @ViewChild('thumbnail') thumbnailImageBox: ElementRef<HTMLElement>;   //thumbnail preview div

  public images: Array<string | ArrayBuffer> = [];
  public techs = Technologies;

  public toolbarOptions = {                               //Quill editor toolbar options

    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      
        [{ 'header': 1 }],                                // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'align': [] }],
      ]
    }
  };
  

  public projectForm = new FormGroup({
    thumbnail: new FormControl('', Validators.required),
    images: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    caption: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    technologies: new FormControl('', Validators.required),
    color: new FormControl('', Validators.required),
    projectlink: new FormControl(null),
    githublink: new FormControl(null),
  });

  private imageInvalidErrorNames: Array<String> = [];                 //names of files that do not match an image type

  constructor(private firebase: FirebaseService) { }

  ngOnInit(): void { }

  /**
   * Submits the project form
   */
  public submitForm() {
    let project = new Project(this.projectForm.controls.name.value, 
                              this.projectForm.controls.caption.value, 
                              this.projectForm.controls.thumbnail.value, 
                              this.projectForm.controls.color.value.hex, 
                              this.projectForm.controls.description.value, 
                              this.projectForm.controls.images.value, 
                              this.projectForm.controls.technologies.value, 
                              this.projectForm.controls.projectlink.value, 
                              this.projectForm.controls.githublink.value);
    
    this.projectFormEmitted.emit(project);
  }


  /**
   * Handles the file input change event fired from the thumbnail file input element
   * 
   * @param event 
   *        The on change event fired from the file input
   */
  public thumbnailInputChange(event) {
    this.projectForm.get('thumbnail').setErrors(null);                      //reset errors on thumbnail
   
    const file: File = this.projectForm.controls.thumbnail.value;           //The file to read

    this.validateImage(file).then(() => {                       
      this.displayThumbnail(file);
    }).catch(err => {                                                         //Validation failed                                           
      event.target.value = null;                                              //clear file input
      this.thumbnailImageBox.nativeElement.style.backgroundImage = '';        //clear thumbnail element background image
      this.projectForm.controls.thumbnail.setValue(null);                     //clear thumbnail value
      this.projectForm.get('thumbnail').setErrors(err);                       //set thumbnail error
    })
  }

  /**
   * Validates an image from the file input. An image is valid if the file type matches an image file.
   * 
   * @param image 
   *        File: image to validate
   * 
   * @returns
   *         Promise<ValidationErrors>: The error if one exists
   */
  public validateImage(image: File): Promise<ValidationErrors> {

    let validationPromise = new Promise<ValidationErrors>((resolve, reject) => {
      if (!image.type.match('image.*')) {                                   //rejects false if the file is not an image type
        this.imageInvalidErrorNames.push(image.name);
        reject({'InvalidFile': true});
        return;
      } else {
        resolve(null);
      }
    });
    
    return validationPromise;
  }

  /**
   * Displays the inputed image for the project thumbnail
   * 
   * @param image 
   *        File: image to display
   */
  public displayThumbnail(image: File): void {
    const filereader = new FileReader();                                    //File reader for the thumbnail input

    filereader.readAsDataURL(image);                                        //read the image
  
    filereader.onload = () => {                                             //Set the thumbnail preview div background
      this.thumbnailImageBox.nativeElement.style.backgroundImage = 'url(' + filereader.result + ')';
    }
  }

  /**
   * Handles the file input change event fired from the images file input element
   * 
   * @param event 
   *        The on change event fired from the file input
   */
  public imagesInputChange(event) { 
    this.images = [];                                                        //clear images array
    this.projectForm.get('images').setErrors(null);                          //reset errors on images

    const files = this.projectForm.controls.images.value;                     //The files to read
    
    this.imageInvalidErrorNames = [];                                         

    this.validateImages(files).then(() => {                                   //validate images
      this.displayImages(files);
    }).catch((err: ValidationErrors) => {                                     //Validation failed
      event.target.value = null;                                              //cleat the file input
      this.projectForm.controls.images.setValue(null);                        //clear images form value
      this.images = [];                                                       //clear images array
      this.projectForm.get('images').setErrors(err);                          //set images form error
    })
  }

  /**
   * Validates an array of images from the file input. An image is valid if the file type matches an image file.
   * 
   * @param images
   *        Array<File>: images to validate
   * 
   * @returns
   *         Promise<ValidationErrors>: The error if one exists
   */
  public validateImages(images: Array<File>): Promise<ValidationErrors> {
    let validationPromises = [];                                    //Array to hold promises of validation
     
    for (let image of images) {                                     //validate each image
      validationPromises.push(this.validateImage(image));
    }

    let validationPromise = new Promise((resolve, reject) => {     //validation promise of all image validations
      Promise.all(validationPromises).then(() => {
        resolve(null);                                            //no error, resolve null
      }).catch(err => {
        reject(err);                                              //Error occured, reject with it 
      })
    })

    return validationPromise;
  }


  /**
   * Displays images of inputted files
   * 
   * @param event 
   *        The on change event fired from the file input
   */
  public displayImages(images: Array<File>): void {

    //Iterate through the image files, read and 
    //push them to the images array
    images.forEach(image => {
      let filereader = new FileReader();
      filereader.readAsDataURL(image);
      filereader.onload = () => {
        this.images.push(filereader.result);
      };
    })
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
      return 'Please input an image';
    } 
  }

  /**
   * Returns the error for the images input
   * 
   * @returns
   *        string: error
   */
  public getImagesErrors(): string {
    
    if (this.projectForm.controls.images.errors.InvalidFile) {
      return 'The following files were not an image type: ' + this.imageInvalidErrorNames;
    } else if (this.projectForm.controls.images.errors.required) {
      return 'Please input at least one image';
    } 
  }

}
