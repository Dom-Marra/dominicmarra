import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Activefragment } from './activefragment';

@Injectable({
  providedIn: 'root'
})
export class ActiveFragService {

  public activeFragment = new BehaviorSubject<Activefragment>(new Activefragment('', false));
  constructor(private router: Router) { 

    //Set the active fragment on route
    this.router.events.pipe(filter(event => event instanceof RoutesRecognized)).subscribe((route: RoutesRecognized) => {
      this.setActiveFrag(new Activefragment(route.state.root.fragment, true));
    });
  }

  /**
   * Sets the active fragment
   * 
   * @param frag 
   *        the fragment
   */
  public setActiveFrag(frag: Activefragment): void {
    if (this.activeFragment.getValue() != frag) {
      this.activeFragment.next(frag);
    }
  }
}
