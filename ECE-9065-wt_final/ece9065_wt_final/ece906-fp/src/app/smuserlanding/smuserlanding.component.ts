import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-smuserlanding',
  templateUrl: './smuserlanding.component.html',
  styleUrls: ['./smuserlanding.component.css']
})
export class SmuserlandingComponent implements OnInit {

  editPlaylistData: any = {}; 

  editSongData: any = {};

  songs : any = [];

  users : any = [];

  reviews : any = [];

  userplaylists : any = [];

  otheruserplaylists : any = [];

  userdata : any = [];

  actdeactusers : any = [];

  actdeactuser : any = [];

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    console.log(localStorage.getItem('userdata'));
    this.userdata = JSON.parse(localStorage.getItem('userdata'));
    this.getSongs();
    this.getPlaylists();
    this.getUsers();
    this.getActDeactUsers();
  }

  logout() {
    localStorage.removeItem('userdata');
    this.router.navigate(['/home']);
  }

  getUsers() {
    this.rest.getUsers(this.userdata.token).subscribe((data: {}) => {
      this.users = data;
      
    });
  }

  getActDeactUsers() {
    this.rest.getUsers(this.userdata.token).subscribe((data: {}) => {
      
      this.actdeactusers = data;
    });
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
    this.rest.getSMSongs(this.userdata.token).subscribe((data: {}) => {
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
    this.rest.getSMPlaylists(this.userdata.token).subscribe((data: {}) => {
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

  openReviewForm(btn, songId, songIndex) {
    var reviewform = document.getElementsByClassName("review-form")[songIndex];
    reviewform['hidden'] = false;
  }

  openAddSongForm() {
    var addSongForm = document.getElementById("addsong-form");
    addSongForm['hidden'] = false;
  }

  openEditSongForm() {
    if(this.songs.length == 0 ) {
      alert("No songs to edit. Please add a song!");
    } else {
    var editSongForm = document.getElementById("editsong-form");
    editSongForm['hidden'] = false;
    }
  }

  openDeleteSongForm() {
    if(this.songs.length == 0 ) {
      alert("No songs to delete.");
    } else {
      var deleteSongForm = document.getElementById("delsong-form");
      deleteSongForm['hidden'] = false;
    }
  }

  openAddPlaylistForm() {
    var addPlaylistForm = document.getElementById("addplaylist-form");
    addPlaylistForm['hidden'] = false;
  }

  openEditPlaylistForm() {
    if(this.userplaylists.length == 0 ) {
      alert("No playlists to edit.");
    } else {
      var editPlaylistForm = document.getElementById("editplaylist-form");
      editPlaylistForm['hidden'] = false;
    }
  }

  openDeletePlaylistForm() {
    if(this.userplaylists.length == 0 ) {
      alert("No playlists to delete.");
    } else {
      var delPlaylistForm = document.getElementById("delplaylist-form");
      delPlaylistForm['hidden'] = false;
    }
  }

  openGrantPrivilegeForm() {
    var grantForm = document.getElementById("grant-form");
    grantForm['hidden'] = false;
  }

  openActDeactUserForm() {
    var actdeactForm = document.getElementById("actdeactuser-form");
    actdeactForm['hidden'] = false;
  }

  cancelAddSong() {
    document.getElementById("visibilityaddsong")['value'] = "";
    document.getElementById("addsong-form").hidden = true;
    document.getElementById("addsong")['reset']();
  }

  cancelEditSong() {
    document.getElementById("editsong-form").hidden = true;
    document.getElementById("editsongf")['reset']();
  }

  cancelDeleteSong() {
    document.getElementById("delsong-form").hidden = true;
    document.getElementById("delsongf")['reset']();
  }
  
  cancelReviewToSong(index) {
    document.getElementsByClassName("review-form")[index]['hidden'] = true;
    document.getElementsByClassName("reviewdesc-input")[index]['value'] = "";
    document.getElementsByClassName("rating-input")[index]['value'] = "";
  }

  cancelGrantPrivilege() {
    document.getElementById("grantform")['reset']();
    document.getElementById("grant-form")['hidden']=true;
  }
  
  changeUser() {
    var actdeactselect = document.getElementById("actdeactselect");
    this.actdeactusers.forEach(user => {
      if(user.username == actdeactselect['value']) {
        this.actdeactuser = user;
      }
    });
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

  cancelDeletePlaylist() {
    document.getElementById("delplaylist-form").hidden = true;
    document.getElementById("delplaylistf")['reset']();
  }

  cancelActDeactUserForm() {
    document.getElementById("actdeactuser-form").hidden = true;
    document.getElementById("actdeactselect")['value'] = "";
    document.getElementById("actdeactselecttwo")['value'] = "";
  }

  actDeactUser(formData) {
    console.log("form data actDeactUser-> " + JSON.stringify(formData));
    this.rest.actDeactUser(formData, this.userdata.token).subscribe((data: {}) => {
      this.getActDeactUsers();
      document.getElementById("actdeactuser-form").hidden = true;
      document.getElementById("actdeactselect")['value'] = "";
      document.getElementById("actdeactselecttwo")['value'] = "";
    });
  }

  grantPrivilege(formData) {
    console.log("form data edit playlist-> " + JSON.stringify(formData));
    this.rest.grantPrivilege(formData.users, this.userdata.token).subscribe((data: {}) => {
      this.users = this.users.filter(function(user){
        return !formData.users.includes(user._id);
      });
      document.getElementById("grantform")['reset']();
      document.getElementById("grant-form")['hidden']=true;
    });
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

  delPlaylist(formData) {
    console.log("form data edit playlist-> " + JSON.stringify(formData));
    this.rest.delPlaylist(formData.playlists, this.userdata.token).subscribe((data: {}) => {
      if(data) {
        this.userplaylists = this.userplaylists.filter(function(up){
          return up._id !== formData.playlists;
        }); 
      }
    });
    document.getElementById("delplaylist-form").hidden = true;
    document.getElementById("delplaylistf")['reset']();
  }

  addSong(formData) {
    console.log("form data add song-> " + JSON.stringify(formData));
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

    });
    document.getElementById("addsong-form").hidden = true;
    document.getElementById("addsong")['reset']();
  }

  editSong(formData) {
      console.log("form data edit song-> " + JSON.stringify(formData));
      this.rest.editSong(formData, this.userdata.token).subscribe((data: {}) => {
        console.log("song-> " + JSON.stringify(data));
        var editedSong;
        this.songs.forEach(song => {
          if(song._id == data['_id']) { 
            song.title = data['title']
            song.artist = data['artist']
            song.album = data['album']
            song.genre = data['genre']
            song.description = data['description']
            song.head = data['head']
            song.year = data['year']
            song.track = data['track']
            song.comment = data['comment']
            song.visibility = data['visibility']
            editedSong = song;
          }
        }); 
        this.songs = this.songs.filter(function(song){
          return song._id !== data['_id'];
        });   
        this.songs.unshift(editedSong);
        document.getElementById("song-select")['value'] ="";
      });
      document.getElementById("editsong-form").hidden = true;
      document.getElementById("editsongf")['reset']();
      document.getElementById("song-select")['value'] ="";
      this.editSongData = {};
  }

  delSong(formData) {
    console.log("form data edit song-> " + JSON.stringify(formData));
      this.rest.delSong(formData._id, this.userdata.token).subscribe((data: {}) => {
          if(data) {
            this.songs = this.songs.filter(function(song){
              return song._id !== formData._id;
            }); 
          }
      });
      document.getElementById("delsong-form").hidden = true;
      document.getElementById("delsongf")['reset']();
      document.getElementById("del-song-select")['value'] ="";
  }
  
  changeSong() {
    var sel = document.getElementById("song-select");
    if(sel['value']) {
      this.songs.forEach(song => {
        if(song._id == sel['value']) {
          this.editSongData = song;
        }
      });
    }
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



