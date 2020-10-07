import { Injectable } from '@angular/core';
import { ProjectObject } from './project';
import { AngularFirestore, AngularFirestoreCollection, DocumentData } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';

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
   * 
   * @returns
   *        Promise<any> resolves doc reference, catches errors
   */
  public addProject(project: ProjectObject): Promise<any> {
    let projectToAdd: ProjectObject = project;                  //data of project to add

    
    let addProjectPromise = new Promise((resolve, reject) => {  //addition promise

      this.uploadImage(<File> project.thumbnail).then((url: string) => {  //upload project thumbnail
        projectToAdd.thumbnail = url;                                     //set project data thumbnail to upload URL

        this.uploadImages(project.images as Array<File>).then((urls: Array<string>) => {  //upload project images
          projectToAdd.images = urls;                                                     //set project data images to upload urls

          this.projectsCollection.add(projectToAdd).then(reference => {                   //add project to firestore
            resolve(reference);                                                           //resolve reference
          }).catch(err => {
            reject(err);                                                                  //catch errors
          });

        }).catch(images => reject("Error: could not upload: " + images));
      }).catch(image => reject("Error: could not upload: " + image.name));
    });

    return addProjectPromise;
  }

  /**
   * Uploads an image to the firestore cloud storage
   * 
   * @param image
   *        File: image to upload 
   * 
   * @returns 
   *        Promise<any> resolves download url, rejects image file
   */
  public uploadImage(image: File): Promise<any> {

    let imageUploadPromise = new Promise<any>((resolve, reject) => {      //promise of the upload

      this.generateUUIDForImage().then(id => {
        const filePath = 'images/' + id;                                  //file path
        const fileRef = this.storage.ref(filePath);                       //reference to the file

        let upload = fileRef.put(image);                                  //upload task

        upload.snapshotChanges().pipe(                                    //resolve url when the task is finalized
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
   * Reads all the documents in the projects collection
   * 
   * @returns
   *        Observable<Array<DocumentData>>
   */
  public readAllDocuments(): Observable<Array<DocumentData>> {

    let readObs = this.projectsCollection.snapshotChanges().pipe(map(actions => { //read observable
      let projects: Array<DocumentData> = [];                                     //array of project docs

      for (let action of actions) {
        projects.push(action.payload.doc);                                        //push each doc of snaphsot change to projects
      }

      return projects;                                                            //return projects

    }));

    return readObs; 
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
  //                        Update FUNCTIONS                               //
  //                                                                       //
  //***********************************************************************//

  /**
   * Updates a project document in the firestore
   * 
   * @param id 
   *        String: id of the project
   * @param projectNew 
   *        ProjectObj: new project data
   * @param projectOld 
   *        ProjObj: old project data
   * 
   * @returns
   *        Promise<any>: Resolves updated doc, rejects with an error
   */
  public updateDoc(id: string, projectNew: ProjectObject, projectOld: ProjectObject): Promise<any> {
    let uploadedImages = [];                                              //array containing urls of uploaded images
    let imagesToRemove = [];                                              //array containing urls of images to remove
    
    let updatePromise = new Promise((resolve, reject) => {                //update promise
      this.updateThumbnail(projectNew, projectOld).then(thumbnail => {    //update thumbnail

        if (projectNew.thumbnail instanceof File) {                       //check if the new thumbnail is a file
          uploadedImages.push(thumbnail);                                 //push new thumbnail url to uploaded images
          imagesToRemove.push(projectOld.thumbnail);                      //push old thumbnail url to imagesToRemove
        }

        projectNew.thumbnail = thumbnail;                                 //set the new projects thumbnail to the one resolved 

        this.updateImages(projectNew, projectOld).then(images => {        //update project images

          if (Array.isArray(projectNew.images) 
          && (projectNew.images as Array<any>).every(item => item instanceof File)) {      //check if new images were files
            uploadedImages.push(images);                                                   //push new image urls to uploaded images
            imagesToRemove = projectOld.images;                                            //push old image urls to imagesToRemove
          }

          projectNew.images = images;                                          //set the new projects images to the resolved ones

          this.projectsCollection.doc(id).update(projectNew).then(doc => {     //Update the document
            this.deleteImages(imagesToRemove).then(() => {                     //remove old images
              resolve(doc);
            }).catch(() => {
              reject("Error: Could not delete old images");                    //catch all errors
            })
          }).catch(() => "Error: could not update the project data");
        }).catch(imageNames => {  
          reject("Error: could not upload : " + imageNames);
        })
      }).catch(imageName => {
        reject("Error: Could not upload : " + imageName);
      })
    });

    return updatePromise;
    
  }

  /**
   * Uploads a new thumbnail if one is provided, otherwise resolves url of old one
   * 
   * @param projectNew 
   *        ProjectObj: new project data
   * @param projectOld 
   *        ProjectObj: old project data
   * @returns
   *        Promise<any>: Resolves url of thumbnail, rejects image name
   */
  public updateThumbnail(projectNew: ProjectObject, projectOld: ProjectObject): Promise<any> {
    let updatePromise = new Promise((resolve, reject) => {
      if (!(projectNew.thumbnail instanceof File)) { 
        resolve(projectOld.thumbnail)                                 //resolve old thumbnail if a new file was not provided
      } else {
        this.uploadImage(<File> projectNew.thumbnail).then(url => {   //upload new thumbnail
          resolve(url);
        }).catch(image => {
          reject(image.name);
        });
      }
    });

    return updatePromise;
  }

  /**
   * Uploads new images for the project, if none are provided this resolves the old images
   * 
   * @param projectNew 
   *        ProjectObj: new project data
   * @param projectOld 
   *        ProjectObj: old project data
   * @returns
   *        Promise<any>: Resolves urls of images, rejects image names
   */
  public updateImages(projectNew: ProjectObject, projectOld: ProjectObject): Promise<any> { 

    let updatePromise = new Promise((resolve, reject) => {
      if (!Array.isArray(projectNew.images)                                         
      || !(projectNew.images as Array<any>).every(item => item instanceof File)) { 
        resolve(projectOld.images)                                                 //Resolve old images if no new images were provided
      } else {  
        this.uploadImages(projectNew.images as Array<File>).then(urls => {          //upload new images
          resolve(urls);
        }).catch(imageNames => {
          reject(imageNames);
        })
      }
    });

    return updatePromise;
  }


  //***********************************************************************//
  //                                                                       //
  //                        Delete FUNCTIONS                               //
  //                                                                       //
  //***********************************************************************//

  /**
   * Deletes a document
   * 
   * @param docId
   *        String: the documents ID
   * 
   * @returns
   *        Promise<any> resolves nothing, rejects errors during deletion 
   */
  public deleteProject(docId: string): Promise<any> {
    let docRef = this.projectsCollection.doc(docId).ref;          //document ref

    let deletePromise = new Promise<any>((resolve, reject) => {   //deletion promise
      docRef.get().then(doc => {                                  //get doc
        this.deleteImage(doc.data().thumbnail).then(() => {       //delete thumbnail
          this.deleteImages(doc.data().images).then(() => {       //delete images
            docRef.delete().then(() => {                          //delete doc
              resolve();
            }).catch(() => {                                        //Catch errors
              reject('Error: could not delete the projects data');
            })
          }).catch(imageName => {
            reject("Error: while deleting file: " + imageName)
          })
        }).catch(imageNames => {
          reject("Error: while deleting files: " + imageNames)
        })
      })
    });

    return deletePromise;
    
  }

  /**
   * Deletes an image
   * 
   * @param url
   *        string: image url 
   * 
   * @returns
   *        Promise<any>: resolves if delete was a success, rejects image name if failed
   */
  public deleteImage(url: string): Promise<any> {

    let imageRef = this.storage.storage.refFromURL(url);            //image reference

    let deletePromise = new Promise<any>((resolve, reject) => {     //deletion promise
      imageRef.delete().then(() => {                                //delete the image
        resolve();                                                  //resolve if deletion was a success
      }).catch(() => {
        reject(imageRef.name);                                      //reject the name of the image if deletion failed
      })
    });

    return deletePromise;
  }

  /**
   * Deletes a subset of images
   * 
   * @param urls 
   *        Array<string>: urls of the images
   * 
   * @returns
   *        Promise<any>: resolves if the deletions went through, rejects array of image names if failed
   */
  public deleteImages(urls: Array<string>): Promise<any> {

    let deletePromises: Array<Promise<any>> = [];                 //array of deletion promises

    for (let url of urls) {
      deletePromises.push(this.deleteImage(url));                 //push each image deletion
    }

    let deletePromise = new Promise((resolve, reject) => {        //Overall deletion promise
      Promise.all(deletePromises.map(p => p.catch(Error))).then(res => {   
        
        let errors = res.filter(errs => errs instanceof Error);     //filter caught errors

        if (errors.length > 0) {                                    //any errors? reject the names of the images that caused them
          reject(errors);
        } else {                                                    //no errors? resolve
          resolve();
        }
      });
    })
    

    return deletePromise;
  }

  //***********************************************************************//
  //                                                                       //
  //                        Misc FUNCTIONS                                 //
  //                                                                       //
  //***********************************************************************//

  /**
   * Generates a UUID for images that are uploaded to the firestore storage
   * 
   * @returns
   *         Promise<string> resolves the UUID for the image
   */
  public generateUUIDForImage(): Promise<string> {

    let id = uuidv4();                                    //generate the UUID

    let generatePromise = new Promise<string>(resolve => {

      this.readImage(id).then(url => {                    //check if image with UUID already exists
        if (url != null) {                                //does re-run function
          this.generateUUIDForImage();
        }
      }).catch(() => {                                    //doesn't resolve it
        resolve(id);
      })
    });

    return generatePromise;
  }
}
