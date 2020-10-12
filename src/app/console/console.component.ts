import { Component, OnInit } from '@angular/core';
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
