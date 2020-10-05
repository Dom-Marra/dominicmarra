import { Injectable } from '@angular/core';
import { ProjectObject } from './project';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, DocumentData } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private projectsCollection: AngularFirestoreCollection<ProjectObject>;

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) {
    this.projectsCollection = this.firestore.collection<ProjectObject>('projects');
  }


  //***********************************************************************//
  //                                                                       //
  //                        Create FUNCTIONS                               //
  //                                                                       //
  //***********************************************************************//

  /**
   * Adds a project to the firestore
   * 
   * @param project 
   */
  public addProject(project: ProjectObject): Promise<any> {
    let projectToAdd: ProjectObject = project;

    
    let addProjectPromise = new Promise((resolve, reject) => {

      this.uploadImage(<File> project.thumbnail).then((url: string) => {
        projectToAdd.thumbnail = url;

        this.uploadImages(project.images as Array<File>).then((urls: Array<string>) => {
          projectToAdd.images = urls;

          this.projectsCollection.add(projectToAdd).then(reference => {
            resolve(reference);
          }).catch(err => {
            reject(err);
          });

        });
      });
      
    });

    return addProjectPromise;
  }

  /**
   * Uploads an image to the firestore cloud storage
   * 
   * @param image
   *        File: image to upload 
   */
  public uploadImage(image: File): Promise<any> {

    let imageUploadPromise = new Promise<any>((resolve, reject) => {      //promise of the upload

      this.generateUUIDForImage().then(id => {
        const filePath = 'images/' + id;                                  //file path
        const fileRef = this.storage.ref(filePath);                       //reference to the file

        let upload = fileRef.put(image);                                //upload task

        upload.snapshotChanges().pipe(                                  //resolve url when the task is finalized
          finalize(() => {

            fileRef.getDownloadURL().subscribe(url => resolve(url));

          })).subscribe();
        
        upload.catch(() => { reject(image)});                          //if there is an error reject with the image file
      });

    });
    

    return imageUploadPromise;
  }

  /**
   * Uploads images to the firestore could storage
   * 
   * @param images 
   *         Files to upload
   * 
   * @returns
   *         Promise<any>: Resolves array of uploaded image Urls, or rejects with the files that could not be uploaded
   */
  public uploadImages(images: Array<File>): Promise<any> {
    let imageUploadPromises = [];                                   //array of upload promises

    for (let image of images) {
      imageUploadPromises.push(this.uploadImage(image));            //upload each image and push it to the imageUploadPromise array
    }

    let finalImagePromise = new Promise<any>((resolve, reject) => {   //Promise of results of the imageUploadPromise

      //Catch all errors that may have occured during the uploading
      Promise.all(imageUploadPromises.map(promise => promise.catch(Error))).then(results => {
        let imageUrls = [];                                           //holds the uploaded image URLS
        let errorImages = [];                                         //holds files that could not upload

        for (let result of results) {                                 
          if (result instanceof Error) {
            errorImages.push(result);                                 //push errors to the errorImages array                 
          } else {
            imageUrls.push(result);                                   //push Urls to the iamgeUrls array
          }
        } 

        errorImages.length > 0 ? reject(errorImages) : resolve(imageUrls);    //If there were errors reject with them, otherwise resolve Urls
      })
    });

    return finalImagePromise;
  }

  //***********************************************************************//
  //                                                                       //
  //                        Read FUNCTIONS                                 //
  //                                                                       //
  //***********************************************************************//

  /**
   * Reads a project by its name in the firestore
   * 
   * @param projectName
   *                   name of the project/doc
   * 
   * @returns
   *          Promise<DocumentData>: resolves the doc data if found, null if not 
   */
  public readProject(projectName: string): Promise<DocumentData> {

    let projRef = this.projectsCollection.doc(projectName).ref;                       //reference of the doc

    let projPromise = new Promise<DocumentData>((resolve, reject) => {                //promise of whether the doc exists  

      projRef.get().then(proj => {                                                    
        if (proj.exists) {                                                            //resolve project if it exists
          resolve(proj);
        } else {                                                                      //reject null if it no project is found
          reject(null);
        }
      })
    });

    return projPromise;
  }

  /**
   * Reads image by its name
   * 
   * @param imageName 
   * 
   * @returns
   *        Promise<string> the url of image if its found, or an error if its not
   */
  public readImage(imageName: string): Promise<string> {

    let readImagePromise = new Promise<string>((resolve, reject) => {   //Promise containing image url if its found

    const ref = this.storage.ref('images/' + imageName);                //path of the image

      //Get the image
      ref.getDownloadURL().toPromise().catch(() => {
        reject(null);                                                   //reject null if nothing is found
      }).then(url => {
        resolve(url);                                                   //resolve url of image if its found
      })
    });

    return readImagePromise;
  }


  //***********************************************************************//
  //                                                                       //
  //                        Misc FUNCTIONS                                 //
  //                                                                       //
  //***********************************************************************//

  public generateUUIDForImage(): Promise<string> {

    let id = uuidv4();

    let generatePromise = new Promise<string>(resolve => {

      this.readImage(id).then(url => {
        if (url != null) {
          this.generateUUIDForImage();
        }
      }).catch(() => {
        resolve(id);
      })
    });

    return generatePromise;
  }
}
