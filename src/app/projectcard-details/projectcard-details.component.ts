import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { Project } from '../project';

@Component({
  selector: 'app-projectcard-details',
  templateUrl: './projectcard-details.component.html',
  styleUrls: ['./projectcard-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectcardDetailsComponent implements OnInit {

  public faGithub = faGithub; //github icon
  public faLink = faLink;     //website link icon

  public projectIcons: Array<any>;    //icons of the project
  public project: Project;           //The project

  constructor(private dialogRef: MatDialogRef<ProjectcardDetailsComponent>, @Inject(MAT_DIALOG_DATA) data) { 
    this.project = data['project'];
  }

  ngOnInit(): void {
    //retreive the icons that belon to the project
    this.projectIcons = this.project.getTechnologyIcons();
  }

  ngAfterViewInit() {
  }

  /**
   * Closes the dialogue
   */
  public close() {
    this.dialogRef.close()
  }

  /**
   * Opens a specified link in a new window
   * 
   * @param url
   *        URL of link to open
   */
  public openLink(url: string) {
    window.open(url, 'newWin');
  }

}
