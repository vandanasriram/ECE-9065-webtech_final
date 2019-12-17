import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) {
    if(this.route.snapshot.queryParams.token) {
      var userdata = jwt_decode(this.route.snapshot.queryParams.token);
      var store = {
        "payload" : userdata,
        "token" : this.route.snapshot.queryParams.token
            }
            localStorage.setItem('userdata', JSON.stringify(store));
            if(store.payload.userType == "sitemanager") {
              this.router.navigate(['/smuser/landing']);
            } else {
              this.router.navigate(['/user/landing']);
            }
            
    }
   }

  ngOnInit() {
    
  }

  signInSaavn() {
    var email = document.getElementById("email-input")['value'];
    var password = document.getElementById("password-input")['value'];
    var userdata = {
      "username" :  email,
      "password" : password
    }
    this.rest.login(userdata).subscribe(
      res => {
          if(res.statusCode != 200) {
            alert(res.msg);
          } else {
            console.log('Success!!.. result-> ' + res);
            var userdata = jwt_decode(res.token);
            var store = {
              "payload" : userdata,
              "token" : res.token
            }
            localStorage.setItem('userdata', JSON.stringify(store));
            if(store.payload.userType == "sitemanager") {
              this.router.navigate(['/smuser/landing']);
            } else {
              this.router.navigate(['/user/landing']);
            }
            
          }  
      },
      err => {
          alert('Error occurred. Try again later');
          console.log(err);
      }
    );

  }

  register() {
    this.router.navigate(['/register']);
  }

  backTohome() {
    this.router.navigate(['/home']);
  }
}

  