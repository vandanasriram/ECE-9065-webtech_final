import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }


  checkUNValidity() {
    var illegalChars = /\W/;
    var textbox = document.getElementById("name-input");
    if (textbox['value'] === '') {
        textbox['setCustomValidity']('Please enter username');
    } else if (illegalChars.test(textbox['value'])){
        textbox['setCustomValidity']('Please enter a valid username');
    } else {
       textbox['setCustomValidity']('');
    }
    return true;
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

  register() {
    var name = document.getElementById("name-input")['value'];
    var email = document.getElementById("email-input")['value'];
    var password = document.getElementById("password-input")['value'];

    var userdata = {
      "name" : name,
      "username" :  email,
      "password" : password
    }
    this.rest.register(userdata).subscribe(
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
            this.router.navigate(['user/verification']);
          }  
      },
      err => {
          alert('Error occurred. Try again later');
          console.log(err);
      }
    );
  }

  backTohome() {
    this.router.navigate(['/home']);
  }

}
