import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ActiveFragService } from './active-frag.service';
import { Activefragment } from './activefragment';

@Directive({
  selector: '[appActiveFragment]'
})
export class ActiveFragmentDirective { 

  @Input() offset: number = 0;                          //amount to offset from the top
  
  @HostListener('window:scroll')
  onScroll() {
    this.setActiveFragment();                         //update if the component is in view on scroll
  }

  @HostListener('window:resize')
  onResize() {
    this.setActiveFragment();                           //update if the component is in view on resize
  }

  constructor(private el: ElementRef, private fragService: ActiveFragService) { 
  }

  ngAfterViewInit(): void {
    this.setActiveFragment();
  }

  /**
   * Updates the active fragment form the fragment service if the component is in view
   */
  public setActiveFragment() {

      let compTop = this.el.nativeElement.offsetTop;                  //components top value
      let compBottom = compTop + this.el.nativeElement.offsetHeight;  //components bottom value

      //calculate if the top portion of the window is within component
      if (Math.ceil(window.scrollY) + this.offset + 50 > compTop && compBottom > Math.ceil(window.scrollY) + this.offset + 50) {
        this.fragService.setActiveFrag(new Activefragment(this.el.nativeElement.id, false));     //update frag service active fragment
      } 
  }

}
