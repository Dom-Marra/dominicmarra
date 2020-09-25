import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Project } from '../project';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ProjectcardDetailsComponent } from '../projectcard-details/projectcard-details.component';

@Component({
  selector: 'app-projectcard',
  templateUrl: './projectcard.component.html',
  styleUrls: ['./projectcard.component.scss']
})

export class ProjectcardComponent implements OnInit {

  @Input() project: Project;

  constructor(private eleRef: ElementRef, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  /**
   * Opens project details dialog with the selected project as the data
   */
  public openProjectDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { project: this.project };
    dialogConfig.panelClass = 'project-details-panel';
    this.dialog.open(ProjectcardDetailsComponent, dialogConfig);
  }

  /**
   * Highlights the cards text
   * 
   * @param highlight
   *        whether to highlight or not
   */
  public highlightCard(highlight: boolean) {
    let highlightElements = this.eleRef.nativeElement.querySelectorAll('.highlight-text');

    highlightElements.forEach(element => {
      element.style.color = highlight ? this.brightenColor(this.project.getColor()) : '#000000';
    });
  }

  /**
   *  Brightens the color of the inputed hex string example: '#FFFFFF'
   * 
   * @param color 
   *        hex color
   * 
   */
  public brightenColor(color: String) {

    color = color.slice(1);                               //remove the # symbol

    let red = parseInt(color.substr(0, 2), 16) / 255;     //the red value
    let green = parseInt(color.substr(2, 2), 16) / 255;   //the greeb value
    let blue = parseInt(color.substr(4, 2), 16) / 255;    //the blue value

    let max = Math.max(red, green, blue);                 //max value of colors
    let min = Math.min(red, green, blue);                 //min value of the colors

    let light = (min + max) / 2;                          //the lightness of the hsl
    let hue = 0;                                          //the hue
    let sat = 0;                                          //the saturation    

    //If min = max its grey scale; others calculate hue and saturation
    if (max != min) {

      //Calc sat
      sat = light < 0.5 ? sat = (max- min)/(max + min) : (max-min)/(2.0-max-min);

      //calc hue depending on max value
      switch(max) {
        case red: {
          hue = (green-blue)/(max-min);
          let shift = 0 / 60;
          if (hue < 0) shift = 360 / 60;
          hue += shift;
          break;
        } 
        case green: {
          hue = (blue - red)/(max-min);
          let shift = 120 / 60;
          hue += shift;
          break;
        }
        case blue: {
          hue = (red - green)/(max-min);
          let shift = 240 / 60;
          hue += shift;
          break;
        }
      }

      //multiply hue by 60 for degrees
      hue *= 60;
    }

    //return lightened value
    return 'hsl(' + Math.floor(hue) + ',' + sat * 100 + '%,' + 80 + '%)';
  }
 
}
