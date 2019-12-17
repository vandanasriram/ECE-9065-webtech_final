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
  checkEmailValidity() {
    var email = document.getElementById("email-input");
    if (email['value'] === '') {
      email['setCustomValidity']('Please enter email address');
    } else if (email['validity'].typeMismatch){
      email['setCustomValidity']('Please enter a valid email address');
    } else {
      email['setCustomValidity']('');
    }
    return true;
  }
  checkPWValidity() {
    var email = document.getElementById("email-input");
    if (email['value'] === '') {
      email['setCustomValidity']('Please enter a password');
    } else {
      email['setCustomValidity']('');
    }
    return true;
  }


  signInSaavn() {
    var emailC = document.getElementById("email-input");
    var passwordC = document.getElementById("password-input");
    if(!emailC['value']) {
      alert("Please enter email address")
      return;
    } else if(!passwordC['value']) {
      alert("Please enter password")
      return;
    } else if(!emailC['checkValidity']()) {
      alert("Please enter valid email");
      return;
    } else if(!passwordC['checkValidity']()) {
      alert("Please enter valid password");
      return;
    }
    var email = emailC['value'];
    var password = passwordC['value'];

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

  