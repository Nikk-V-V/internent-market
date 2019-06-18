import { Component, OnInit } from '@angular/core';
import { CategoryComponent } from '../category/category.component';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { from } from 'rxjs';
import { AppComponent } from '../app.component';
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 
  currentSlids: any;
  righ = 0;
  timer: any;
  revisedItems: any;
  condition : boolean;
  products: any;
  date = new Date();
  newProducts: any;

  constructor(
      private data: DataService, 
      private app: AppComponent, 
      private rest: RestApiService
    ) {}

  ngOnInit() {
    this.getSlids();
    this.autoSlider();
    this.reviserdItems();
    this.getNewProduct();
  }

  reviserdItems() {
    this.revisedItems = this.data.getRevised();
    if(this.revisedItems.length >= 1){
      return this.condition = true
    } else {
      return this.condition = false;
    }
  }

  async getSlids() {
    try {
      const data = await this.rest.get(
        'https://localhost:3030/api/accounts/profile/api/slids'
      );
      data['success']
        ? (this.currentSlids = data['slids'])
        : this.data.error(data['message']);
      } catch (error) {
        this.data.error(error['message']);
      }
  }

  widthSid() {
    return this.app.widthSid();
  }

  left(){
    let content = document.getElementById('content').offsetWidth;
    this.righ = this.righ - 960;
    if(this.righ == -960){
      this.righ = content * this.currentSlids.length - 960;
      clearTimeout(this.timer);
    }
    document.getElementById('content').style.right = `${this.righ}px`;
    clearTimeout(this.timer);
    this.autoSlider();
  }
  right(){
    let content = document.getElementById('content').offsetWidth;
    this.righ = this.righ + 960;
        if(this.righ >= content * this.currentSlids.length){
          this.righ = 0;
          clearTimeout(this.timer);
        }
        document.getElementById('content').style.right = `${this.righ}px`;
        clearTimeout(this.timer);
        this.autoSlider();
  }

 autoSlider(){
  let content = document.getElementById('content').offsetWidth;
  this.timer = setTimeout((x) =>{
    if(this.righ >= content * this.currentSlids.length - 960){
      this.righ = 0;
      clearTimeout(this.timer);
    } else{
      this.righ += 960;
    }
    document.getElementById('content').style.right =  `${this.righ}px`;
    this.autoSlider();
  },10000);
 }
 
 showHidenList1(){
   let button = document.getElementById('arrButtonNewProduct');
   let list = document.getElementById('newProduct');
   if(button.className == 'fas fa-arrow-circle-down') {
     list.style.overflow = 'none';
     list.style.height = 'auto'
     button.classList.remove('fa-arrow-circle-down');
     button.classList.add('fa-arrow-circle-up');
   } else {
      list.style.overflow = 'hiden';
      list.style.height = '375px'
      button.classList.remove('fa-arrow-circle-up');
      button.classList.add('fa-arrow-circle-down');
   }
 }
 
 showHidenList2(){
  let button = document.getElementById('arrButton');
  let list = document.getElementById('revisedItems');
  if(button.className == 'fas fa-arrow-circle-down') {
    list.style.overflow = 'none';
    list.style.height = 'auto'
    button.classList.remove('fa-arrow-circle-down');
    button.classList.add('fa-arrow-circle-up');
  } else {
     list.style.overflow = 'hiden';
     list.style.height = '375px';
    
     button.classList.remove('fa-arrow-circle-up');
     button.classList.add('fa-arrow-circle-down');
  }
}


 async getNewProduct(event?: any) {
  
  if (event) {
    this.products = null;
  }
  try {
    const data = await this.rest.get(
      `https://localhost:3030/api/allProduct`,
    );
    data['success']
      ? ( this.products = data)
      : this.data.error(data['message']);
  } catch (error) {
    this.data.error(error['message']);
  }
  let month = this.date.getMonth() + 1;
  this.newProducts = this.products.product.filter(x => + x.crated[6] == month);
  this.newProducts.reverse();
 }
}
