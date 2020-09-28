import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators';

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

  constructor(private router: Router) { 

    //Scroll to an related element based on the routed fragment
    this.router.events.pipe(filter(event => event instanceof RoutesRecognized))
    .subscribe((route: RoutesRecognized) => {

      let el = document.querySelector('#' + route.state.root.fragment); //element to scroll to

      if (el != null) {                                                 //only scroll if an element was found
        let top = el.getBoundingClientRect().top                        //calculate the scroll amount
                - this.navOffsetHeight 
                + window.scrollY;
        window.scrollTo({behavior: "smooth", top: top});
      }
      
    });
  }

  ngOnInit(): void {

  }

  ngAfterContentInit(): void {
    this.setNavOffset();
  }

  /**
   * Set offset for Active Fragment directive based on the navbar height
   */
  private setNavOffset(): void {
    this.navOffsetHeight = document.querySelector('#navbar-container').getBoundingClientRect().height;
  }

}
