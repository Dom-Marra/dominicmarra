import { Component, ElementRef, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActiveFragService } from '../active-frag.service';
import { Activefragment } from '../activefragment';
import { FirebaseService } from '../firebase.service';
import { Project } from '../project';
import { options } from '../projectcarousel/projectcarousel.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {          

  public fragOffset: number = 75;                 //offset for fragement directive

  public carouselOptions: options = {             //carousel options
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
  private activeFrag: BehaviorSubject<Activefragment>;    //frag service active fragment

  constructor(private fragService: ActiveFragService, private firebase: FirebaseService, private element: ElementRef) { 
    this.activeFrag = this.fragService.activeFragment;

    this.firebase.readAllDocuments().subscribe(projs => {     //get observable of all projects
      this.projects = [];                                     //re-init projects

      projs.forEach(proj => {                                 //create a project data for each project
        this.projects.push(new Project(proj.data()));         //push project data
      });
    });
  }

  ngOnInit(): void { }

  ngAfterViewInit() {

    this.activeFrag.subscribe(activeFrag => {        
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
}
