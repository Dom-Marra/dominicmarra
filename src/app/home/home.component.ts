import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActiveFragService } from '../active-frag.service';
import { FirebaseService } from '../firebase.service';
import { Project } from '../project';
import { options } from '../projectcarousel/projectcarousel.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  @HostListener('window:resize')
  onResize() {
    this.setNavOffset();
  }

  public navOffsetHeight: number;                       

  public top: number = 0;                       //window scrollY value until active directive scroll can be re-enabled 

  public carouselOptions: options = {
    slidesToDisplay: 3,
    responsive: [
      {
        windowSize: 1250,
        slidesToDisplay: 2,
      },
      {
        windowSize: 790,
        slidesToDisplay: 1,
      }
    ]
  }

  public projects: Array<Project> = [];                   //stores project doc data
  private activeFrag;

  constructor(private fragService: ActiveFragService, private firebase: FirebaseService, private element: ElementRef) { 

    this.firebase.readAllDocuments().subscribe(projs => {     //get observable of all projects
      this.projects = [];                                     //re-init projects

      projs.forEach(proj => {                                 //create a project data for each project
        this.projects.push(new Project(proj.data()));         //push project data
      });

    });
  }

  ngOnInit(): void { }

  ngAfterContentInit(): void {
    this.setNavOffset();

    this.activeFrag = this.fragService.activeFragment.subscribe(activeFrag => {        
      if (activeFrag.getWasRouted()) {
        let el = document.querySelector('#' + activeFrag.getFragment());  //element to scroll to

        if (el != null) {                                                 //only scroll if an element was found
          let top = el.getBoundingClientRect().top -                      //calculate the scroll amount
                    this.element.nativeElement.getBoundingClientRect().top;            
          try {
            window.scrollTo({behavior: "smooth", top: top});
          } catch (e) {
            window.scrollTo(0, top);
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.activeFrag.unsubscribe();
  }


  /**
   * Set offset for Active Fragment directive based on the navbar height
   */
  private setNavOffset(): void {
    this.navOffsetHeight = document.querySelector('#navbar-container').getBoundingClientRect().height;
  }
}
