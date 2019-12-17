import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registerver',
  templateUrl: './registerver.component.html',
  styleUrls: ['./registerver.component.css']
})
export class RegisterverComponent implements OnInit {

  userdata : any = [];

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.userdata = JSON.parse(localStorage.getItem('userdata'));
  }

  verifyEmail() {
    this.rest.verifyEmail(this.userdata['token']).subscribe((data: {}) => {
      if(this.userdata.payload.userType == "sitemanager") {
        this.router.navigate(['/smuser/landing']);
      } else {
        this.router.navigate(['/user/landing']);
      }
    });
  }

}
