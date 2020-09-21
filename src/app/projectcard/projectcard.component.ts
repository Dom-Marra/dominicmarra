import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition, query, group, animateChild } from '@angular/animations';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { Project } from '../project';

@Component({
  selector: 'app-projectcard',
  templateUrl: './projectcard.component.html',
  styleUrls: ['./projectcard.component.scss'],
  animations: [
    trigger('upDown', [
      state('down', style({
        height: '100%'
      })),
      state('up', style({
        height: '0'
      })),
      transition('down <=> up', [
        animate('0.5s ease-out')
      ])
    ])
  ]
})

export class ProjectcardComponent implements OnInit {

  @Input() project: Project;

  public faGithub = faGithub; //github icon
  public faLink = faLink;     //website link icon

  public upDown = "up";       //project card details state
    
  public projectIcons: Array<any>;    //icons of the project

  constructor(private eleRef: ElementRef) { }

  ngOnInit(): void {
    //retreive the icons that belon to the project
    this.projectIcons = this.project.getTechnologyIcons();
  }

  /**
   * Toggles the cards animation
   * 
   * @param element 
   *        the card
   */
  public toggleCard(element: Element) {
    if (this.upDown == "up") {
      this.upDown = "down";
      this.scrollToCard(element);
    } else {
      this.upDown = "up";
    }
  }

  /**
   * Scrolls to the card
   * 
   * @param element 
   *        the card
   */
  public scrollToCard(element: Element) {
    element.scrollIntoView({behavior: "smooth", block: "start"});
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
