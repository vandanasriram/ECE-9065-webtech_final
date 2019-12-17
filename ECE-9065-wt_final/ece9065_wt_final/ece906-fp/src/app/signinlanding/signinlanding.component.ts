import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service'; 
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signinlanding',
  templateUrl: './signinlanding.component.html',
  styleUrls: ['./signinlanding.component.css']
})
export class SigninlandingComponent implements OnInit {

  gmailurl = "";

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.getGmailUrl();
  }

  getGmailUrl() {
    this.rest.getGmailUrl().subscribe((data: {}) => {
      console.log(JSON.stringify(data));
      this.gmailurl = data['url'];
    });
  }

  signinsaavn() {
    this.router.navigate(['/signin']);
  }

  signingmail() {

  }

  register() {
    this.router.navigate(['/register']);
  }

  backTohome() {
    this.router.navigate(['/home']);
  }
}
