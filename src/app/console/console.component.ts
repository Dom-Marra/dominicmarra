import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { faPlusSquare, faTrashAlt, faEdit, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  public faPlusSquare = faPlusSquare;             //Add project icon
  public faTrashAlt = faTrashAlt;                 //delete project icon
  public faEdit = faEdit;                         //update project icon
  public faSignOutAlt = faSignOutAlt;             //logout icon

  @ViewChild('sideNav') sideNav: ElementRef;      //the side navigation bar

  @HostListener('window:scroll') onScroll() { //TODO: Set navbar size as global scss variable
    if (Math.floor(window.scrollY) > 90) {
      this.sideNav.nativeElement.classList.add('adjustScrollFixed');
    } else if (Math.floor(window.scrollY) < 75) {
      this.sideNav.nativeElement.classList.remove('adjustScrollFixed');
    }
  }

  constructor(private auth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Logs out user
   */
  public logout() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

}
