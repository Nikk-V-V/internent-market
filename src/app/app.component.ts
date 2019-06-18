import { Component, OnInit } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { from } from 'rxjs';
import { Router } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  words: string;
  searchTerm = '';
  isCollpased = true;
  
  constructor ( 
    private router: Router,
    public data: DataService
    ) {
      this.data.getProfile();
      this.data.cartItems = this.data.getCart().length;
    }

  ngOnInit() {
    this.check();
  }
  get token() {
    return localStorage.getItem('token');
  }
  collapse () {
    this.isCollpased = true;
  }
  showHiden () {
    let side = document.getElementById('sidMenu');
    let main = document.querySelector('section');
    let lef = 0;
    if (side.style.display == 'grid') {
      side.style.display = 'none'; 
      main.style.marginLeft = `${lef}px`;
    } else {
      side.style.display = 'grid';
      lef = 280;
      main.style.marginLeft = `${lef}px`;
    }
  }
  closeDropdown (dropdown) {
    dropdown.close();
  }
  check() {
    let side = document.getElementById('sidMenu');
    if(side.style.display === 'grid') {
      side.style.display = 'none';
    }
  }

  widthSid(){
    let side = document.getElementById('sidMenu');
    let main = document.querySelector('section');
    side.style.height = `${main.offsetHeight}px`;
  }
  logout() {
    this.data.user = {};
    localStorage.clear();
    this.router.navigate(['']);
  }

  search() {
    if (this.searchTerm) {
      this.collapse();
      this.router.navigate(['search', { query: this.searchTerm }]);
    }
  } 
  autorisationAdmin() {
    let div = document.getElementById('admin-login');
    if(div.hidden == true){
      div.hidden = false;
    } else {
      div.hidden = true;
    }
  }

}
