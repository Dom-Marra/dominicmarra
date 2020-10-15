import { Component, ElementRef, HostListener, OnInit, ViewChild, Directive, ViewEncapsulation, ContentChild, TemplateRef, Input, IterableDiffers} from '@angular/core';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { GestureController } from '@ionic/angular';

export interface options {
  slidesToDisplay: number,
  responsive?: Array<{
    windowSize: number,
    slidesToDisplay: number
  }>
}

@Directive({
  selector: '[sliderContents]'
})
export class TranscludeDirective { }

@Component({
  selector: 'app-projectcarousel',
  templateUrl: './projectcarousel.component.html',
  styleUrls: ['./projectcarousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectcarouselComponent implements OnInit {

  @Input('options') carouselOptions: options = {
    slidesToDisplay: 1
  }

  @ViewChild('carousel') carousel: ElementRef;
  @ViewChild('slidesContainer') slidesContainer: ElementRef;
  @ContentChild(TranscludeDirective, { read: TemplateRef }) transcludeTemplate;
  private slides: Array<Element> = [];

  @HostListener('window:resize')
  onResize() {
    this.reinitCarouselView();
  }

  public faChevronLeft = faChevronLeft;         //next slide icon
  public faChevronRight = faChevronRight;       //previous slide icon

  public currentAnimations = 0;                   //is the carousel animating

  public currentSlideCount: number = 0;         //slider counter

  public swipeAmnt: number = 0;                 //current swipe amount

  public iterableDiffer;

  constructor(private gestureCtrl: GestureController, private iterableDiffers: IterableDiffers) { 
    this.iterableDiffer = iterableDiffers.find([]).create(null);
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked() {
    if (this.slidesContainer != null) { //update carousel when contents change
      let changes = this.iterableDiffer.diff(this.slidesContainer.nativeElement.children);
      if (changes) {
        this.reinitCarouselView();
      }
    }
  }

  ngAfterViewInit(): void {
    this.reinitCarouselView();

    //Gesture object
    const gesture = this.gestureCtrl.create({
      el: this.slidesContainer.nativeElement,
      gestureName: 'carousel-swipe',
      onMove: (swipe) => { this.onSwipe(swipe); },
      onEnd: (swipe) => { this.onSwipeEnd(swipe) },
      onStart: () => { this.onSwipeStart() }
    });
    gesture.enable();
  }


  /**
   * Handles when the swipe event is occuring
   * 
   * @param swipe 
   *        swipe data object
   */
  public onSwipe(swipe) {
    let slideWidth = this.slides[0].getBoundingClientRect().width;           //get the slides width
    let swipeAmnt = this.swipeAmnt + swipe.deltaX;                           //Updated swipe amount is current + the swipe X delta 

    let slideContWidth = this.slidesContainer.nativeElement.offsetWidth;     //swipe container width
    
     //If the updated swipe amount is less than negative half of the slide container
     //Or the swipe amount is greater than zero then update the slides to be in view
    if (swipeAmnt < slideContWidth / -2 || swipeAmnt > 0) {                
      swipeAmnt = swipeAmnt + ((slideContWidth / 2) * Math.floor(swipeAmnt / (slideContWidth / -2)));  
    }

    this.currentSlideCount = (swipeAmnt / slideWidth);      //update current slide count
    this.animateMovement(swipeAmnt, true);                  //animate the swipe
  }

  /**
   * Handles when the swipe event starts
   */
  public onSwipeStart() {
    let slideWidth = this.slides[0].getBoundingClientRect().width;        //slide width
    this.swipeAmnt = slideWidth * this.currentSlideCount;                 //update swipe amount 

    this.slidesContainer.nativeElement.classList.add('disable-click');    //disable click events
  }

  /**
   * Handles when the swipe event ends on the carousel
   * 
   * @param swipe
   *        the data passed by the swip event 
   */
  public onSwipeEnd(swipe) {
    let slideWidth = this.slides[0].getBoundingClientRect().width;        //slide width
    this.swipeAmnt = slideWidth * this.currentSlideCount;                 //update slide amount
    let slideDifference: number = 0;                                      //difference between the start and end x values


    //Update Slide difference and current slide depending on start and end x values
    if (swipe.startX > swipe.currentX) {                                               
      slideDifference = Math.floor(this.currentSlideCount) - this.currentSlideCount;    //right swipe => adjust to left
      this.currentSlideCount = Math.floor(this.currentSlideCount);                      
    } else {
      slideDifference = Math.ceil(this.currentSlideCount) - this.currentSlideCount;     //left swipe => adjust to right
      this.currentSlideCount = Math.ceil(this.currentSlideCount);
    }

    let slideAmount = (slideWidth * slideDifference) + this.swipeAmnt;      //amount to slide by to get the appropriate slide
    this.animateMovement(slideAmount);                                    

    this.slidesContainer.nativeElement.classList.remove('disable-click');   //re-enable click events
  }

  /**
   * Will adjust the carousel container width, and repositions the slides container to the current slide
   */
  public reinitCarouselView() {

    this.slides = Array.from(this.slidesContainer.nativeElement.children);

    this.setCarouselWidth();                                                        //adjust width of carousel container

    let slideWidth = this.slides[0].getBoundingClientRect().width;                  //get width of a slide

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

    
    let slidesToDisplay = this.carouselOptions.slidesToDisplay;

    let slideWidth = (carouselWidth / slidesToDisplay);             //initial slide width is a third of wrapper width

    if (this.carouselOptions.responsive != null) {                  //adjust slide width on screen width
      for (let resp of this.carouselOptions.responsive) {
        if (resp.windowSize >= screenWidth) {
          slideWidth = (carouselWidth / resp.slidesToDisplay);
        }
      }
    }

    slidesContainerWidth = slideWidth * this.slides.length;   //calculate slides container width to account for double the amount of slides

    this.slidesContainer.nativeElement.style.width = slidesContainerWidth.toFixed(0) + 'px';  //set inline width of slides container
  }

  /**
   * Moves the carousel to reveal the next slide
   */
  public next() {

    if (this.currentAnimations > 0) return;                                         //return if currently animating
    let slideWidth = this.slides[0].getBoundingClientRect().width;                  //get width of a slide

    if (this.currentSlideCount - 1 == (((this.slides.length / 2) * -1) - 1)) {      //once the end is reached reset to the first slide
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
    
    if (this.currentAnimations > 0) return;                                         //return if currently animating
    
    let slideWidth = this.slides[0].getBoundingClientRect().width;                  //get width of a slide

    if (this.currentSlideCount + 1 == 1) {                                          //if slide reaches the start move to end - 1 (account for movement)
      let offsetSlideCount = (((this.slides.length / 2) * -1) - 1);
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
    this.currentAnimations++;

    this.slidesContainer.nativeElement.animate([
      {transform: 'translateX(' + slideAmount + 'px)'}
    ], {fill: 'both', easing: 'ease-in-out', duration: instant ? 0 : 400}).finished.then(() => {
      this.slidesContainer.nativeElement.style.transform = 'translateX(' + slideAmount + 'px)';       //adjust inline style
      this.currentAnimations--;                                                                       //animation is complete
    });
  }

}