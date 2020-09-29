import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren, Renderer2, ViewContainerRef} from '@angular/core';
import { Project, Technologies } from '../project';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-projectcarousel',
  templateUrl: './projectcarousel.component.html',
  styleUrls: ['./projectcarousel.component.scss'],
})
export class ProjectcarouselComponent implements OnInit {

  @ViewChild('carousel') carousel: ElementRef;
  @ViewChild('slidesContainer') slidesContainer: ElementRef;
  @ViewChildren('slide', {read: ElementRef}) slide: QueryList<ElementRef>;

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
    "non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", [], [Technologies.HTML], "", ""),
    new Project("BL3CALC", "Borderlands 3 Build Planner", "URL(TEST)", "#00A0D2", "Lorem ipsum dolor sit amet, " +
    "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim " + 
    "veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor " + 
    "in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", [], [], "", ""),
    new Project("Dominic Marra", "Portfolio", "URL(TEST)", "#FF00F5", "Lorem ipsum dolor sit amet, " +
    "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim " + 
    "veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor " + 
    "in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat " + 
    "non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", [], [], "", ""),
    new Project("MAC: Mobile Attacks & Countermeasures", "Malicious Attack Information", "URL(TEST)", "#5b5e62", "Lorem ipsum dolor sit amet, " +
    "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim " + 
    "veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", [], [], "", ""),
    new Project("WasteBook", "Food Waste Log", "URL(TEST)", "#8B4513", "Lorem ipsum dolor sit amet, " +
    "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim " + 
    "veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", [], [], "", "")
  ]

  constructor() { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.setCarouselWidth();
  }

  /**
   * Will adjust the carousel container width, and repositions the slides container to the current slide
   */
  public reinitCarouselView() {

    this.setCarouselWidth();                                                        //adjust width of carousel container

    let slideWidth = this.slide.first.nativeElement.getBoundingClientRect().width;  //get width of a slide

    let slideAmount = slideWidth * this.currentSlideCount;                          //get amount to transition the slides container

    this.animateMovement(slideAmount, true);                                        //transition the slides container
  }


  /**
   * Sets the width of the carousel container
   */
  public setCarouselWidth() {

    let slidesContainerWidth = 0;                                                                 //width of div that holds slides
    let screenWidth = document.documentElement.offsetWidth;                                       //browser width
    let carouselContStyle = window.getComputedStyle(<HTMLElement> this.carousel.nativeElement);   //styles of the carousel wrapper div
    let carouselWidth = parseFloat(carouselContStyle.width)                                       //get width of the carousel wrapper div
                      - parseFloat(carouselContStyle.paddingLeft)
                      - parseFloat(carouselContStyle.paddingRight);

    let slideWidth = (carouselWidth / 3);             //initial slide width is a third of wrapper width

    if (screenWidth > 790 && screenWidth <= 1250) {   //adjust slide width on screen width
      slideWidth = (carouselWidth / 2);
    } else if (screenWidth <= 790) {
      slideWidth = carouselWidth;
    }

    slidesContainerWidth = slideWidth * (this.projects.length * 2);   //calculate slides container width to account for double the amount of slides

    this.slidesContainer.nativeElement.style.width = slidesContainerWidth.toFixed(0) + 'px';  //set inline width of slides container
  }


  /**
   * Moves the carousel to reveal the next slide
   */
  public next() {

    if (this.isAnimating) return;                                                   //return if currently animating
    let slideWidth = this.slide.first.nativeElement.getBoundingClientRect().width;  //get width of a slide

    if (this.currentSlideCount - 1 == ((this.projects.length * -1) - 1)) {          //once the end is reached reset to the first slide
      let offsetSlideCount = 0;

      this.animateMovement(0, true);
      
      this.currentSlideCount = offsetSlideCount;                                    //reset the slide count
    }

    let slideAmount = (slideWidth * this.currentSlideCount--) - slideWidth;         //calculate the amount to slide by and update the counter

    this.animateMovement(slideAmount);                                              //transition the slides container
  }

  /**
   * Moves the carousel to reveal the previous slide
   */
  public previous() {
    
    if (this.isAnimating) return;                                                   //return if currently animating
    
    let slideWidth = this.slide.first.nativeElement.getBoundingClientRect().width;  //get width of a slide

    if (this.currentSlideCount + 1 == 1) {                                          //if slide reaches the start move to end - 1 (account for movement)
      let offsetSlideCount = ((this.projects.length * -1) - 1);
      let offsetTransition = (slideWidth * offsetSlideCount) + slideWidth;          //calc slide amount

      this.animateMovement(offsetTransition, true);                                 //transition the slides container

      this.currentSlideCount = offsetSlideCount + 1;                                //adjust the slide container
    }

    let slideAmount = (slideWidth * this.currentSlideCount++) + slideWidth;         //calc slide amount
    
    this.animateMovement(slideAmount);                                              //transition the slide container
  }

  /**
   * Transitions the carousel
   * 
   * @param slideAmount 
   *        amount to transition by
   */
  public animateMovement(slideAmount: number, instant?: boolean) {
    this.isAnimating = true;                                          //set animating

    this.slidesContainer.nativeElement.animate([
      {transform: 'translateX(' + slideAmount + 'px)'}
    ], {fill: 'both', easing: 'ease-in-out', duration: instant ? 0 : 300}).finished.then(() => {
      this.slidesContainer.nativeElement.style.transform = 'translateX(' + slideAmount + 'px)';       //adjust inline style
      this.isAnimating = false;                                                                       //animation is complete
    });
  }

}
