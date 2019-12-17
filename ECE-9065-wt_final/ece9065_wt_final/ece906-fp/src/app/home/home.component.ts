import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public searchText = "";
  songs : any = [];

  reviews : any = [];

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.getTopSongs();
  }

  orinarySignIn() {
    this.router.navigate(['/registration/signin']);
  }

  async getTopSongs() {
    this.songs = [];
    await this.rest.getTopSongs().subscribe((data: {}) => {
      console.log("getTopSongs-> " + JSON.stringify(data));
      this.songs = data;
      this.songs.forEach( element => {
        this.rest.getReviewsOfSong(element._id).subscribe((data: {}) => {
          console.log("getReviewsOfSong-> " + JSON.stringify(data));
          element.review = data;
          element.reviewCount = data['length'];
          var rating = 0;
          element.review.forEach(rev => {
            rating = rating + parseInt(rev.rating);
            this.rest.getUserDetailsByUserId(rev.userId).subscribe((data: {}) => {
              console.log("getUserDetailsByUserId-> " + JSON.stringify(data));
              rev.userDetails= data;
            });
          });
          console.log("review length-> " + element.review.length);
          element.avgRating = (Math.round((rating/element.review.length) * 10) / 10).toFixed(1);
        });
      });
    });
  }

  getSongAndReviewInfo(btn, songId, songIndex) {
    var cbutton = document.getElementsByClassName("collapsible")[songIndex];
    var abutton = document.getElementsByClassName("active")[songIndex];
    var content = document.getElementsByClassName("song-info")[songIndex];
      if (content['style']['display'] === "block") {
        content['style']['display'] = "none";
        if(abutton)
          abutton.className = "collapsible";
      } else {
        content['style']['display'] = "block";
        if(cbutton)
          cbutton.className = "active";
      }
  }

  register() {
    this.router.navigate(['/register']);
  }
}
