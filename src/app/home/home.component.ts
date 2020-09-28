import { Component, HostListener, OnInit } from '@angular/core';
import { ActiveFragService } from '../active-frag.service';

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

  public top: number = 0;                                      //window scrollY value until active directive scroll can be re-enabled 

  constructor(private fragService: ActiveFragService) { 

    this.fragService.activeFragment.subscribe(activeFrag => {
    
      if (activeFrag.getWasRouted()) {
        let el = document.querySelector('#' + activeFrag.getFragment());  //element to scroll to

        if (el != null) {                                                 //only scroll if an element was found
          let top = Math.ceil(el.getBoundingClientRect().top              //calculate the scroll amount
                  - this.navOffsetHeight 
                  + window.scrollY);
                  
          try {
            window.scrollTo({behavior: "smooth", top: top});
          } catch (e) {
            window.scrollTo(0, top);
          }
        }
      }
    });
  }

  ngOnInit(): void { }

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
