import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  login_endpoint = 'http://localhost:8080/login';
    httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })  
  };

  constructor(private http: HttpClient) { 
  }

  //Sign In - Login
  login(userdata): Observable<any> {
    return this.http.post<any>('http://localhost:8080/login', userdata);
  }

  //Sign In - Register
  register(userdata): Observable<any> {
    return this.http.post<any>('http://localhost:8080/register', userdata);
  }

  //Gmail URL for signin
  getGmailUrl(): Observable<any> {
    return this.http.get('http://localhost:8080/google/url').pipe(
      map(this.extractData));
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  //Get Top songs
  getTopSongs(): Observable<any> {
    return this.http.get('http://localhost:8080/song/toplist').pipe(
      map(this.extractData));
  }

  //Get Song Info
  getSongInfo(songId): Observable<any> {
    return this.http.get('http://localhost:8080/song/' + songId).pipe(
      map(this.extractData));
  }

  //Get Reviews of a song
  getReviewsOfSong(songId): Observable<any> {
    return this.http.get('http://localhost:8080/review/' + songId).pipe(
      map(this.extractData));
  }

  //Get User Details By User Id
  getUserDetailsByUserId(userId): Observable<any> {
    return this.http.get('http://localhost:8080/user/' + userId).pipe(
      map(this.extractData));
  }

  //Get songs for valid/authorized user
  getSongs(token): Observable<any> {
     var headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': 'Bearer ' + token
    });
    return this.http.get('http://localhost:8080/secure/song', {headers:headers}).pipe(
      map(this.extractData));
  }

  getPlaylists(token): Observable<any> {
    var headers = new HttpHeaders({
       'Content-Type':  'application/json',
       'authorization': 'Bearer ' + token
   });
   return this.http.get('http://localhost:8080/secure/playlists', {headers:headers}).pipe(
     map(this.extractData));
 }

 getOtherUserPlaylists(token): Observable<any> {
  var headers = new HttpHeaders({
     'Content-Type':  'application/json',
     'authorization': 'Bearer ' + token
 });
 return this.http.get('http://localhost:8080/secure/playlists/others', {headers:headers}).pipe(
   map(this.extractData));
}

addReviewToSong(body, token): Observable<any> {
  var headers = new HttpHeaders({
     'Content-Type':  'application/json',
     'authorization': 'Bearer ' + token
 });
 return this.http.post('http://localhost:8080/secure/review', body, {headers:headers}).pipe(
   map(this.extractData));
}

addSong(body, token): Observable<any> {
  var headers = new HttpHeaders({
     'Content-Type':  'application/json',
     'authorization': 'Bearer ' + token
 });
 return this.http.post('http://localhost:8080/secure/song', body, {headers:headers}).pipe(
   map(this.extractData));
}

addPlaylist(body, token): Observable<any> {
  var headers = new HttpHeaders({
     'Content-Type':  'application/json',
     'authorization': 'Bearer ' + token
 });
 return this.http.post('http://localhost:8080/secure/playlist', body, {headers:headers}).pipe(
   map(this.extractData));
}

editPlaylist(body, token): Observable<any> {
  var headers = new HttpHeaders({
     'Content-Type':  'application/json',
     'authorization': 'Bearer ' + token
 });
 return this.http.put('http://localhost:8080/secure/playlist', body, {headers:headers}).pipe(
   map(this.extractData));
}

editSong(body, token): Observable<any> {
  var headers = new HttpHeaders({
     'Content-Type':  'application/json',
     'authorization': 'Bearer ' + token
 });
 return this.http.put('http://localhost:8080/secure/song', body, {headers:headers}).pipe(
   map(this.extractData));
}

delSong(songId, token): Observable<any> {
  var headers = new HttpHeaders({
     'Content-Type':  'application/json',
     'authorization': 'Bearer ' + token
 });
 return this.http.delete('http://localhost:8080/secure/song/' + songId, {headers:headers}).pipe(
   map(this.extractData));
}

delPlaylist(playlistId, token): Observable<any> {
  var headers = new HttpHeaders({
     'Content-Type':  'application/json',
     'authorization': 'Bearer ' + token
 });
 return this.http.delete('http://localhost:8080/secure/playlist/' + playlistId, {headers:headers}).pipe(
   map(this.extractData));
}

getSMSongs(token): Observable<any> {
  var headers = new HttpHeaders({
     'Content-Type':  'application/json',
     'authorization': 'Bearer ' + token
 });
 return this.http.get('http://localhost:8080/secure/smsongs' , {headers:headers}).pipe(
   map(this.extractData));
}

getSMPlaylists(token): Observable<any> {
  var headers = new HttpHeaders({
    'Content-Type':  'application/json',
    'authorization': 'Bearer ' + token
});
return this.http.get('http://localhost:8080/secure/smplaylists', {headers:headers}).pipe(
  map(this.extractData));
}

getUsers(token): Observable<any> {
  var headers = new HttpHeaders({
    'Content-Type':  'application/json',
    'authorization': 'Bearer ' + token
});
return this.http.get('http://localhost:8080/secure/user' , {headers:headers}).pipe(
  map(this.extractData));
}

grantPrivilege(users, token): Observable<any> {
  var headers = new HttpHeaders({
    'Content-Type':  'application/json',
    'authorization': 'Bearer ' + token
});
return this.http.put('http://localhost:8080/secure/user/privilege' , {users : users},{headers:headers}).pipe(
  map(this.extractData));
}

getActDeactUsers(users, token): Observable<any> {
  var headers = new HttpHeaders({
    'Content-Type':  'application/json',
    'authorization': 'Bearer ' + token
});
return this.http.get('http://localhost:8080/secure/actdeactuser' , {headers:headers}).pipe(
  map(this.extractData));
}

actDeactUser(body, token): Observable<any> {
  var headers = new HttpHeaders({
    'Content-Type':  'application/json',
    'authorization': 'Bearer ' + token
});
return this.http.put('http://localhost:8080/secure/user/activation' , body, {headers:headers}).pipe(
  map(this.extractData));
}

verifyEmail(token): Observable<any> {
  var headers = new HttpHeaders({
    'Content-Type':  'application/json',
    'authorization': 'Bearer ' + token
});
return this.http.get('http://localhost:8080/secure/user/verification' , {headers:headers}).pipe(
  map(this.extractData));
}

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
