import { Component, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Project, Technologies } from '../project';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-projectcarousel',
  templateUrl: './projectcarousel.component.html',
  styleUrls: ['./projectcarousel.component.scss']
})
export class ProjectcarouselComponent implements OnInit {

  @ViewChildren('slides') slides: QueryList<any>;
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {

    //restore positioning of the slides on window resize
    let container = document.getElementById('project-container');
    let projects = Array.from(container.getElementsByClassName('project') as HTMLCollectionOf<HTMLElement>);
    this.setSlidesPositions(projects);
  }
  
  public faChevronLeft = faChevronLeft;         //next slide icon
  public faChevronRight = faChevronRight;       //previous slide icon

  public isAnimating: boolean = false;          //check for if animation is executing

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

    let container = document.getElementById('project-container');                                                 //container of slided
    let projects = Array.from(container.getElementsByClassName('project') as HTMLCollectionOf<HTMLElement>);      //array of slides

    //Set default order
    projects.forEach((slide: HTMLElement, index) => {
      this.setOrder(slide, index);
    });

    //set default positions
    this.setSlidesPositions(projects);

    //update the slide orders when new slides are added or removed
    this.slides.changes.subscribe(t => {
      this.shiftSlideOrder();
      this.setSlidesPositions(projects);
    })
  }

  /**
   * Sets the default data-order attribute tag of a slide
   * 
   * @param slide
   *        HTMLElement: slide to set 
   * @param slideIndex 
   *        number: index of the slide 
   */
  public setOrder(slide: HTMLElement, slideIndex: number) {

    //when index = number of slides, it is moved behind the first slide
    if (slideIndex != this.projects.length - 1) {
      slide.setAttribute('data-order', slideIndex.toString());
    } else {
      slide.setAttribute('data-order', (-1).toString());
    }
  }

  /**
   * Positions the slide based on its data-order attribute, this applies instantly
   * 
   * @param slide 
   *        HTMLElement: slide to position
   */
  public setSlidePosition(slide: HTMLElement) {
    this.isAnimating = true;

    let order = parseInt(slide.getAttribute('data-order'));
    this.animateSlide(slide, order, true);
  }

  /**
   * Positions an array of slides, this applies instantly
   * 
   * @param slides
   *        Array<HTMLElement>
   */
  public setSlidesPositions(slides: Array<HTMLElement>) {
    for (let slide of slides) {
      this.setSlidePosition(slide);
    }
  }

  /**
   * Shifts the order of the slides
   */
  public shiftSlideOrder() {
    let container = document.getElementById('project-container');                                             //container of slides
    let projects = Array.from(container.getElementsByClassName('project') as HTMLCollectionOf<HTMLElement>);  //Array of slides

    let projectLast = projects[projects.length - 2];      //the last slide before modification

    let inserted = projects[projects.length - 1];         //the inserted side

    let projectLastOrder = parseInt(projectLast.getAttribute('data-order'));    //the data-order value of the last slide

    if (projectLastOrder != -1) {                    //if the projectLast data-order value equals 1 all slides are in the defaut ordering

      projects.forEach((project: HTMLElement) => {                  //iterate through slides
        let order = parseInt(project.getAttribute('data-order'));   //get data-order of slide

        if (order <= projectLastOrder && order != -1) {             //change slide order if its behind the projectLast slide
          project.setAttribute('data-order', (order - 1).toString());
        } else if (order == -1) {                                   //when the order is -1 the slide is set to the max order value
          project.setAttribute('data-order', (this.projects.length - 2).toString());
        }
      });
                                                                  
      inserted.setAttribute('data-order', projectLastOrder.toString());       //update the inserted slide value to the projectLastOrder value
      
    } else {                                                                  //only update projectLast slide and the inserted when carousel is in default position
      
      projectLast.setAttribute('data-order', (projects.length - 2).toString());   //projectLast order is set to maximum  
      inserted.setAttribute('data-order', projectLastOrder.toString());           //inserted slide is set to minimum
    }
  }

  /**
   * Moves the carousel to reveal the next slide
   */
  public next() {

    if (this.isAnimating) return;         //dont move if currently moving

    this.isAnimating = true;              //block other carousel movement actions

    let container = document.getElementById('project-container');                                             //container of slides

    let projects = Array.from(container.getElementsByClassName('project') as HTMLCollectionOf<HTMLElement>);  //Array of slides

    //Loop through the slides and change their order
    for (let i = 0; i < projects.length; i++) {
      let order = parseInt(projects[i].getAttribute('data-order')) - 1;   //reduce order by 1
      
      if (order == -2) {                                                  //if order reaches -2 set order to be max
        order = projects.length - 2;
        projects[i].style.visibility = 'hidden';                          //hide for styling purposing during animation
      }

      this.animateSlide(projects[i], order, false);                       //prompt the animation
      projects[i].setAttribute('data-order', order.toString());           //update the data-order attribute of the slide
    }

  }

  /**
   * Moves the carousel to reveal the previous slide
   */
  public previous() {

    if (this.isAnimating) return;         //dont move if currently moving
    this.isAnimating = true;              //block other carousel movement actions

    let container = document.getElementById('project-container');                                             //container of slides

    let projects = Array.from(container.getElementsByClassName('project') as HTMLCollectionOf<HTMLElement>);  //Array of slides

    //Loop through the slides and change their order
    for (let i = 0; i < projects.length; i++) {
      let order = parseInt(projects[i].getAttribute('data-order')) + 1;   //increase order by 1
      

      if (order == projects.length - 1) {                                 //if order reaches max set order to be minimum
        order = -1;
        projects[i].style.visibility = 'hidden';                          //hide for styling purposing during animation
      }

      projects[i].setAttribute('data-order', order.toString());           //prompt the animation

      this.animateSlide(projects[i], order, false);                       //update the data-order attribute of the slide
      
    }
  }

  /**
   * Animates a slides movement
   * 
   * @param slide 
   *        HTMLElement: the slide
   * @param order   
   *        number: the slides data-order value
   * @param instant
   *        boolean: whether the animation should be instant or not 
   */
  public animateSlide(slide: HTMLElement, order: number, instant?: boolean) {
    let transform = slide.offsetWidth * order;        //amount to move by

    
    slide.animate([
      {transform: 'translateX(' + transform + 'px)'}  //translate by calculated amount
    ], {fill: 'forwards', easing: 'ease-in-out', duration: instant ? 0 : 300, iterations: 1}).finished.then(() => {

      slide.style.visibility = "visible";                           //set visibility to be visible upon completion
    
      slide.style.transform = 'translateX(' + transform + 'px)';    //update inline style value
      this.isAnimating = false;                                     //no longer animation
    })
  }

}
