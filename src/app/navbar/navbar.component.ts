import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActiveFragService } from '../active-frag.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @ViewChild('navContainer') navContainer: ElementRef;      //Nav container element

  public activeFragment: string = null;                     //Observable of current fragment in view
  
  constructor(private fragService: ActiveFragService) { 
    this.fragService.activeFragment.subscribe(frag => {
      if (frag.getWasRouted() && this.activeFragment == null) {
        this.activeFragment = frag.getFragment();
      } else if (!frag.getWasRouted() && frag.getFragment() != this.activeFragment) {
        this.activeFragment = frag.getFragment();
      } else if (frag.getWasRouted() && frag.getFragment() == null) {
        this.activeFragment = null;
      }
    });
  }


  ngOnInit(): void {
  }

  /**
   * Adds hovered class to a nav link
   * 
   * @param event 
   *        Event that fired the function
   */
  public addHovered(event) {
    let fireTouch: boolean;

    try {
      fireTouch = event.sourceCapabilities.firesTouchEvents;
    } catch {
      fireTouch = false;
    }
    if (!fireTouch) event.target.classList.add('hovered');
  }

  /**
   * Removes hovered class to a nav link
   * 
   * @param event 
   *         Event that fired the function
   */
  public removeHovered(event) {
    event.target.classList.remove('hovered');
  }

}
