import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren, Renderer2, ViewContainerRef} from '@angular/core';
import { Project, Technologies } from '../project';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-projectcarousel',
  templateUrl: './projectcarousel.component.html',
  styleUrls: ['./projectcarousel.component.scss'],
})
export class ProjectcarouselComponent implements OnInit {

  @ViewChild('carouselContainer') carouselContainer: ElementRef;
  @ViewChildren('slides', {read: ElementRef}) slidesOriginal: QueryList<ElementRef>;
  @ViewChildren('slideCopies', {read: ElementRef}) slidesCopy: QueryList<ElementRef>;

  @HostListener('window:resize')
  onResize() {
    this.reinitCarouselView();
  }

  public faChevronLeft = faChevronLeft;         //next slide icon
  public faChevronRight = faChevronRight;       //previous slide icon

  public isAnimating = false;                   //is the carousel animating

  public currentSlideCount: number = 0;         //slider counter

  //Test slides
  public projects = [
    new Project("Vape It", "Store Catalogue", "URL(TEST)", "#FFD600", "Lorem ipsum dolor sit amet, " +
    "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim " + 
    "veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor " + 
    "in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat " + 
    "non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", [], [Technologies.HTML], "", "", ""),
    new Project("BL3CALC", "Borderlands 3 Build Planner", "URL(TEST)", "#00A0D2", "Lorem ipsum dolor sit amet, " +
    "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim " + 
    "veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor " + 
    "in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", [], [], "", "", ""),
    new Project("Dominic Marra", "Portfolio", "URL(TEST)", "#FF00F5", "Lorem ipsum dolor sit amet, " +
    "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim " + 
    "veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor " + 
    "in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat " + 
    "non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", [], [], "", "", ""),
    new Project("MAC: Mobile Attacks & Countermeasures", "Malicious Attack Information", "URL(TEST)", "#5b5e62", "Lorem ipsum dolor sit amet, " +
    "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim " + 
    "veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", [], [], "", "", ""),
    new Project("WasteBook", "Food Waste Log", "URL(TEST)", "#8B4513", "Lorem ipsum dolor sit amet, " +
    "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim " + 
    "veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", [], [], "", "", "")
  ]

  constructor() { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.setCarouselWidth();
  }

  /**
   * Will reset the carousel width, and repositions it to the current slide
   */
  public reinitCarouselView() {

    this.setCarouselWidth();

    let slideWidth = (<HTMLElement> this.carouselContainer.nativeElement.getElementsByClassName('project')[0]).offsetWidth;

    let slideAmount = slideWidth * this.currentSlideCount;

    this.carouselContainer.nativeElement.animate([
      {transform: 'translate3D(' + slideAmount + 'px, 0, 0)'}
    ], {fill: 'both', duration: 0});
  }

  

  /**
   * Sets the width of the carousel
   */
  public setCarouselWidth() {

    let carouselContainerWidth = 0;
    let currentScreenWidth = document.documentElement.offsetWidth;
    let slideWidth = (document.documentElement.offsetWidth / 3);

    if (currentScreenWidth > 790 && currentScreenWidth <= 1250) {
      slideWidth = (document.documentElement.offsetWidth / 2);
    } else if (currentScreenWidth <= 790) {
      slideWidth = document.documentElement.offsetWidth;
    }

    carouselContainerWidth = slideWidth * (this.projects.length * 2);

    this.carouselContainer.nativeElement.style.width = carouselContainerWidth + 'px';
  }


  /**
   * Moves the carousel to reveal the next slide
   */
  public next() {

    if (this.isAnimating) return;
    let slideWidth = (<HTMLElement> this.carouselContainer.nativeElement.getElementsByClassName('project')[0]).offsetWidth;

    if (this.currentSlideCount - 1 == ((this.projects.length * -1) - 1)) {
      let offsetSlideCount = 0;
      
      this.carouselContainer.nativeElement.animate([
        {transform: 'translate3D(' + 0 + 'px, 0, 0)'}
      ], {fill: 'both', duration: 0, delay: 0});

      this.currentSlideCount = offsetSlideCount;
    }

    let slideAmount = (slideWidth * this.currentSlideCount--) - slideWidth;

    this.animateMovement(slideAmount);
  }

  /**
   * Moves the carousel to reveal the previous slide
   */
  public previous() {
    
    if (this.isAnimating) return;
    
    let slideWidth = (<HTMLElement> this.carouselContainer.nativeElement.getElementsByClassName('project')[0]).offsetWidth;

    if (this.currentSlideCount + 1 == 1) {
      let offsetSlideCount = ((this.projects.length * -1) - 1);
      let offsetTransition = (slideWidth * offsetSlideCount) + slideWidth;

      this.carouselContainer.nativeElement.animate([
        {transform: 'translate3D(' + offsetTransition + 'px, 0, 0)'}
      ], {fill: 'both', duration: 0});

      this.currentSlideCount = offsetSlideCount + 1;
    }

    let slideAmount = (slideWidth * this.currentSlideCount++) + slideWidth;
    
    this.animateMovement(slideAmount);
  }

  public animateMovement(slideAmount: number) {
    this.isAnimating = true;

    this.carouselContainer.nativeElement.animate([
      {transform: 'translate3D(' + slideAmount + 'px, 0, 0)'}
    ], {fill: 'forwards', easing: 'ease-in-out', duration: 300}).finished.then(() => {
      this.isAnimating = false;
    });
  }

}
