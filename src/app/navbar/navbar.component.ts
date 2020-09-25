import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger("downUp", [ 
      state("down", style({
        transform: 'translateY(10px)',
        color: "lightblue"
      })),
      state("up", style({
        transform: 'translateY(0px)'
      })),
      transition('down <=> up', [
        animate('0.1s')
      ])
    ]),
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

  @HostListener('window:scroll') 
  onScroll() {

    //Set navbar state depending on scroll position
    if (window.scrollY >= 90 && this.navBarSize == "large") {
      this.navBarSize = 'small';
      this.setNavBarHeight();
    } else if (window.scrollY < 90 && this.navBarSize == "small") {
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

  
  public navItems = [                     //state of the navlinks
    {state: "up"},
    {state: "up"},
    {state: "up"},
  ];

  
  public navBarSize: string = "large";    //state of the navbar container
  public navBarBaseHeight: number;        //navbar default height (changes depending if mobile or desktop)
  public navBarCurrentHeight: number;     //current height of the navbar
  public lastWindowSize: number;          //last known window size

  constructor() { }

  ngOnInit(): void {
    this.lastWindowSize = window.innerWidth;
    this.navBarBaseHeight = document.getElementById('navbar-container').offsetHeight;
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


  /**
   * Changes the state of the navlink when hovered over
   * 
   * @param navLinkIndex
   *        The index of the nav link
   */
  hoverNavLink(navLinkIndex: number) {
    this.navItems[navLinkIndex].state = "down";
  }
  /**
   * Changes the state of the navlink when hovered over
   * 
   * @param navLinkIndex
   *        The index of the nav link
   */
  leaveNavLink(navLinkIndex: number) {
    this.navItems[navLinkIndex].state = "up";
  }

}
