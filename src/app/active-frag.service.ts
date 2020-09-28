import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActiveFragService {

  public activeFragment = new BehaviorSubject<string>('');
  constructor(private router: Router) { 

    //Set the active fragment on route
    this.router.events.pipe(filter(event => event instanceof RoutesRecognized)).subscribe((route: RoutesRecognized) => {
      this.setActiveFrag(route.state.root.fragment);
    });
  }

  /**
   * Sets the active frag ment
   * 
   * @param frag 
   *        the fragment
   */
  public setActiveFrag(frag: string): void {
    if (this.activeFragment.getValue() != frag) {
      this.activeFragment.next(frag);
    }
  }
}
