import { Component, OnInit } from '@angular/core';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public faGithub = faGithub;
  public faLinkedin = faLinkedin;

  constructor() { }

  ngOnInit(): void {
  }

  public openLink(url: string): void {
    window.open(url, 'newWin');
  }

}
