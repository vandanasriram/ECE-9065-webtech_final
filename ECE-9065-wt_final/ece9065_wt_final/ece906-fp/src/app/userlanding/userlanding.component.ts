import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-userlanding',
  templateUrl: './userlanding.component.html',
  styleUrls: ['./userlanding.component.css']
})
export class UserlandingComponent implements OnInit {

  editPlaylistData: any = {}; 
  public searchText = ""
  songs : any = [];

  reviews : any = [];

  userplaylists : any = [];

  otheruserplaylists : any = [];

  userdata : any = [];

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    console.log(localStorage.getItem('userdata'));
    this.userdata = JSON.parse(localStorage.getItem('userdata'));
    this.getSongs();
    this.getPlaylists();
    this.getOtherUserPlaylists();
  }

  logout() {
    localStorage.removeItem('userdata');
    this.router.navigate(['/home']);
  }

  changePlaylist() {
    var sel = document.getElementById("playlist-select");
    if(sel['value']) {
      this.userplaylists.forEach(pl => {
        if(pl._id == sel['value']) {
          this.editPlaylistData = pl;
        }
      });
    }
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
  
  getSongs() {
    this.songs = [];
    this.rest.getSongs(this.userdata.token).subscribe((data: {}) => {
      console.log("getTopSongs-> " + JSON.stringify(data));
      this.songs = data;
      this.songs.forEach( element => {
        this.rest.getReviewsOfSong(element._id).subscribe((data: {}) => {
          console.log("getReviewsOfSong-> " + JSON.stringify(data));
          element.review = data;
          element.review.forEach(rev => {
            this.rest.getUserDetailsByUserId(rev.userId).subscribe((data: {}) => {
              console.log("getUserDetailsByUserId-> " + JSON.stringify(data));
              rev.userDetails= data;
            });
          });
        });
      });
      console.log("get songs data-> " + JSON.stringify(this.songs));
    });
  }

  getPlaylists() {
    this.rest.getPlaylists(this.userdata.token).subscribe((data: {}) => {
      console.log("getPlaylists-> " + JSON.stringify(data));
      this.userplaylists = data;
      this.userplaylists.forEach( playlist => {
        playlist.songinfo = [];
        playlist.songs.forEach(song => {
          this.rest.getSongInfo(song).subscribe((data: {}) => {
            playlist.songinfo.push(data);
          });
        });
      });
    });
  }

  getOtherUserPlaylists() {
    this.rest.getOtherUserPlaylists(this.userdata.token).subscribe((data: {}) => {
      console.log("getOtherUserPlaylists-> " + JSON.stringify(data));
      this.otheruserplaylists = data;
      if(this.otheruserplaylists.length != 0) {
        this.otheruserplaylists.forEach( playlist => {
          playlist.songinfo = [];
          playlist.songs.forEach(song => {
            this.rest.getSongInfo(song).subscribe(async (data: {}) => {
              await this.rest.getUserDetailsByUserId(data['createdByUser']).subscribe((userdata: {}) => {
                console.log("getUserDetailsByUserId-> " + JSON.stringify(userdata));
                data['userDetails']= userdata;
              });
              playlist.songinfo.push(data);
          });
          });
          
        });
        console.log("Dataa-> " + JSON.stringify(this.otheruserplaylists))
      }
    });
  }

  changeAddReviewInSong() {
    var reviewyes = document.getElementById("reviewyes");
    var reviewno = document.getElementById("reviewno");
    var reviewSongForm = document.getElementById("review-song-form");
    if(!reviewyes['checked'] && !reviewno['checked']) {
      return;
    } else if(!reviewyes['checked'] && reviewno['checked']) {
      reviewSongForm['hidden'] = true;
      return;
    } else if(reviewyes['checked'] && !reviewno['checked']) {
      reviewSongForm['hidden'] = false;
    }
  }

  cancelAddSong() {
    document.getElementById("addsong-form").hidden = true;
    document.getElementById("review-song-form").hidden = true;
    document.getElementById("addsong")['reset']();
  }

  cancelAddPlaylist() {
    document.getElementById("addplaylist-form").hidden = true;
    document.getElementById("addplaylist")['reset']();
  }

  cancelEditPlaylist() {
    this.editPlaylistData = {};
    document.getElementById("editplaylist-form").hidden = true;
    document.getElementById("editplaylist")['reset']();
  }

  cancelReviewToSong(index) {
    document.getElementsByClassName("review-form")[index]['hidden'] = true;
    document.getElementsByClassName("reviewdesc-input")[index]['value'] = "";
    document.getElementsByClassName("rating-input")[index]['value'] = "";
  }

  openReviewForm(btn, songId, songIndex) {
    var reviewform = document.getElementsByClassName("review-form")[songIndex];
    reviewform['hidden'] = false;
  }

  openAddSongForm() {
    var addSongForm = document.getElementById("addsong-form");
    addSongForm['hidden'] = false;
  }

  openAddPlaylistForm() {
    var addPlaylistForm = document.getElementById("addplaylist-form");
    addPlaylistForm['hidden'] = false;
  }

  openEditPlaylistForm() {
    if(this.userplaylists.length == 0) {
      alert("You have no playlists to edit. Create a playlist!");
    } else {
      var editPlaylistForm = document.getElementById("editplaylist-form");
      editPlaylistForm['hidden'] = false;
    }
  }

  editPlaylist(formData) {
    console.log("form data edit playlist-> " + JSON.stringify(formData));
    this.rest.editPlaylist(formData, this.userdata.token).subscribe((data: {}) => {
      console.log("songs-> " + JSON.stringify(data));
        data['songinfo'] = [];
        data['songs'].forEach(song => {
          this.rest.getSongInfo(song).subscribe((sdata: {}) => {
            data['songinfo'].push(sdata);
          });
        });
        this.userplaylists = this.userplaylists.filter(function(userplaylist){
          return userplaylist._id !== data['_id'];
        });   
        this.userplaylists.unshift(data);
    });
    this.editPlaylistData = {};
    document.getElementById("editplaylist-form").hidden = true;
    document.getElementById("editplaylist")['reset']();
  }

  addPlaylist(formData) {
    console.log("form data add playlist-> " + JSON.stringify(formData));
    this.rest.addPlaylist(formData, this.userdata.token).subscribe((data: {}) => {
        data['songinfo'] = [];
        data['songs'].forEach(song => {
          this.rest.getSongInfo(song).subscribe((sdata: {}) => {
            data['songinfo'].push(sdata);
          });
        });
        this.userplaylists.unshift(data);
    });
    document.getElementById("addplaylist-form").hidden = true;
    document.getElementById("addplaylist")['reset']();
  }

  addSong(formData) {
    console.log("form data add song-> " + JSON.stringify(formData));
    var reviewyes = document.getElementById("reviewyes");
    var reviewno = document.getElementById("reviewno");
    this.rest.addSong(formData, this.userdata.token).subscribe((data: {}) => {
        this.rest.getReviewsOfSong(data['_id']).subscribe((rdata: {}) => {
          console.log("getReviewsOfSong-> " + JSON.stringify(rdata));
          data['review'] = rdata;
          data['review'].forEach(rev => {
            this.rest.getUserDetailsByUserId(rev.userId).subscribe((data: {}) => {
              console.log("getUserDetailsByUserId-> " + JSON.stringify(data));
              rev.userDetails= data;
            });
          });
          this.songs.unshift(data);
        });
        if(reviewyes['checked'] && !reviewno['checked']) {
          var body = {
            "songId" : data['_id'],
            "value" : document.getElementById("song-reviewdesc-input")['value'],
            "rating" : document.getElementById("song-rating-input")['value']
          };
          this.rest.addReviewToSong(body, this.userdata.token).subscribe((data: {}) => {
            console.log("response from adding review to song is -> "+ JSON.stringify(data));
            this.rest.getUserDetailsByUserId(data['userId']).subscribe((userdata: {}) => {
              console.log("getUserDetailsByUserId-> " + JSON.stringify(userdata));
              data['userDetails']= userdata;
              this.songs.forEach(song => {
                if(song._id == body.songId) {
                  song.review.unshift(data);
                }
              });
            });
          });
        }
    document.getElementById("addsong-form").hidden = true;
    document.getElementById("review-song-form").hidden = true;
    document.getElementById("addsong")['reset']();
    });  
    
  }
  
  addReviewToSong(btn, songId, index) {
    var reviewdescinput = document.getElementsByClassName("reviewdesc-input")[index]['value'];
    var ratinginput = document.getElementsByClassName("rating-input")[index]['value'];
    var body = {
      "value" : reviewdescinput,
      "rating" : ratinginput,
      "songId" : songId,
      "visibility" : "show"
    };
    this.rest.addReviewToSong(body, this.userdata.token).subscribe((data: {}) => {
      console.log("response from adding review to song is -> "+ JSON.stringify(data));
      this.rest.getUserDetailsByUserId(data['userId']).subscribe((userdata: {}) => {
        console.log("getUserDetailsByUserId-> " + JSON.stringify(userdata));
        data['userDetails']= userdata;
        this.songs.forEach(song => {
          if(song._id == songId) {
            song.review.unshift(data);
          }
        });
      });
      
      document.getElementsByClassName("review-form")[index]['hidden'] = true;
      document.getElementsByClassName("reviewdesc-input")[index]['value'] = "";
      document.getElementsByClassName("rating-input")[index]['value'] = "";
    });
  }

  getPlaylistSongInfo(btn, index) {
    var cbutton = document.getElementsByClassName("collapsible-up")[index];
    var abutton = document.getElementsByClassName("active-up")[index];
    var content = document.getElementsByClassName("playlistsonginfo")[index];
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

  getOtherPlaylistSongInfo(btn, index) {
    var cbutton = document.getElementsByClassName("collapsible-oup")[index];
    var abutton = document.getElementsByClassName("active-oup")[index];
    var content = document.getElementsByClassName("otherplaylistsonginfo")[index];
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

  
}
