import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(private http: HttpClient) { }

  getHeaders() {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders().set('Authorization', token) : null
  }

  get(link) {
    return this.http.get(link, {headers: this.getHeaders()}).toPromise();
  }
  post(link, body) {
    return this.http.post(link, body, {headers: this.getHeaders()}).toPromise();
  }
}
