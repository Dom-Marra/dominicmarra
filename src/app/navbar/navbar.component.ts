import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ActiveFragService } from '../active-frag.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger("shrinkEnlarge", [ 
      state("small", style({
        height: '{{navBarHeight}}px'
      }), {params: {navBarHeight: 75}}),
      state("large", style({
        height: '{{navBarHeight}}px'
      }), {params: {navBarHeight: 90}}),
      transition('small <=> large', [
        animate('0.1s')
      ])
    ])
  ]
})
export class NavbarComponent implements OnInit {

  @ViewChild('navContainer') navContainer: ElementRef;      //Nav container element

  @HostListener('window:scroll') 
  onScroll() {

    //Set navbar state depending on scroll position
    if (Math.floor(window.scrollY) > 90 && this.navBarSize == "large") {
      this.navBarSize = 'small';
      this.setNavBarHeight();
    } else if (Math.floor(window.scrollY) < 75 && this.navBarSize == "small") {
      this.navBarSize = 'large';
      this.setNavBarHeight();
    }

  }

  @HostListener('window:resize') onResize(e: Event): void {

    //Set the navabr height based on window size
    if (window.innerWidth > 790 && this.lastWindowSize <= 790) {
      this.navBarBaseHeight = 90;
      this.lastWindowSize = window.innerWidth;
      this.setNavBarHeight();
    } else if (window.innerWidth <= 790 && this.lastWindowSize > 790) {
      this.navBarBaseHeight = 110;
      this.lastWindowSize = window.innerWidth;
      this.setNavBarHeight();
    }

  }

  
  public navBarSize: string = "large";    //state of the navbar container
  public navBarBaseHeight: number;        //navbar default height (changes depending if mobile or desktop)
  public navBarCurrentHeight: number;     //current height of the navbar
  public lastWindowSize: number;          //last known window size

  public activeFragment: BehaviorSubject<string>;     //Observable of current fragment in view
  
  constructor(private fragService: ActiveFragService) { 
    this.activeFragment = this.fragService.activeFragment;
  }


  ngOnInit(): void {
    this.lastWindowSize = window.innerWidth;
  }

  ngAfterViewInit() {
    this.navBarBaseHeight = this.navContainer.nativeElement.offsetHeight;
  }

  /**
   * Sets the navbar containers height, which is used as a parameter in its
   * animations
   */
  setNavBarHeight() {

    switch (this.navBarSize) {
      case "large" : {
        this.navBarCurrentHeight = this.navBarBaseHeight;
        break;
      }
      case "small": {
        this.navBarCurrentHeight = this.navBarBaseHeight * 0.9;
        break;
      }
    } 
  }

}
