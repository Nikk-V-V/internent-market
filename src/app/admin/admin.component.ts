import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  product = {
    title: '',
    price: 0,
    markId:'',
    categoryId: '',
    description: '',
    images: null
  };
  
  categories: any;
  marks: any;
  currentPhrases : any;
  btnDisabled = false;
  currentSlids: any;
  currentOrders: any;
  slids = {
    images:null
  };

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.getCategories();
    this.getMarks();
    this.getPharases();
    this.getSlids();
    this.getOrderList();
  }


 async getCategories() {
    try {
      const data = await this.rest.get(
        'https://localhost:3030/api/categories'
      );
      data['success']
        ? (this.categories = data['categories'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  async getMarks() {
    try {
      const data = await this.rest.get(
        'https://localhost:3030/api/marks'
      );
      data['success']
        ? (this.marks = data['marks'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  async getPharases() {
    try {
      const data_ = await this.rest.get(
        'https://localhost:3030/api/phrases'
      );
      data_['success']
        ? (this.currentPhrases = data_['phrases'])
        : this.data.error(data_['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  async getSlids() {
    try {
          const data = await this.rest.get(
            'https://localhost:3030/api/slids'
          );
          data['success']
            ? (this.currentSlids = data['slids'])
            : this.data.error(data['message']);
        } catch (error) {
          this.data.error(error['message']);
        }
  }

  validate(product) {
    if (product.title) {
      if (product.price) {
        if(product.markId){
          if (product.categoryId) {
            if (product.description) {
              if (product.images) {
                return true;
              } else {
                this.data.error('Please select product image.');
              }
            } else {
              this.data.error('Please enter description.');
            }
          } else {
            this.data.error('Please select category.');
          }
        }else {
          this.data.error('Please select mark.');
        }
      } else {
        this.data.error('Please enter a price.');
      }
    } else {
      this.data.error('Please enter a title.');
    }
  }

  fileChange(event: any) {
    this.product.images = event.target.files[0];
  }

  async post() {
    this.btnDisabled = true;
    try {
      if (this.validate(this.product)) {
        const form = new FormData();
        for (const key in this.product) {
          if (this.product.hasOwnProperty(key)) {
            if (key === 'images') {
              form.append(
                'images',
                this.product.images,
                this.product.images.name
              );
            } else {
              form.append(key, this.product[key]);
            }
          }
        }
        const data = await this.rest.post(
          'https://localhost:3030/api/seller/products',
          form
        );
        data['success']
          ? this.router.navigate(['/profile/myproducts'])
            .then(() => this.data.success(data['message']))
            .catch(error => this.data.error(error))
          : this.data.error(data['message']);
      }
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

  async updatePhrases() {
    try {
      const res = await this.rest.post(
        'https://localhost:3030/api/phrases',
        this.currentPhrases
      );
      res['успішно']
        ? (this.data.success(res['message']), await this.data.getAdminka())
        : this.data.error(res['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  fileChange2(event: any) {
    this.slids.images = event.target.files[0];
    this.updateSlids();
  }
  async updateSlids() {
    try {
        const form = new FormData();
        for (const key in this.slids) {
          if (this.slids.hasOwnProperty(key)) {
            if (key === 'images') {
              form.append(
                'images',
                this.slids.images,
                this.slids.images.name
              );
            } else {
              form.append(key, this.slids[key]);
            }
          }
        }
        const data = await this.rest.post(
          'https://localhost:3030/api/slids',
          form
        );
        data['success']
          ? this.router.navigate(['/profile/myproducts'])
            .then(() => this.data.success(data['message']))
            .catch(error => this.data.error(error))
          : this.data.error(data['message']);
      } catch (error) {
      this.data.error(error['message']);
    }
  }

  check() {
    
  }

  async getOrderList() {
    try {
      const data = await this.rest.get(
        'https://localhost:3030/api/orders'
      );
      data['success']
        ? (this.currentOrders = data['order'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }
  reviseStatus(order) {
    order.status = 'Відправлено'
  }

  async updateOrder() {

    let order = this.currentOrders;

    try {
       const data = await this.rest.post(
        'https://localhost:3030/api/orders',
         order
      )
      data['успішно']
      ? (this.data.success(data['message']), await this.data.getAdminka())
      : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  checkProduct() { 
    let productP = document.getElementById('post-productPanel'),
        phares = document.getElementById('pharasPanel'),
        slid = document.getElementById('slidPanel'),
        order = document.getElementById('orderList');
    if(productP.hidden == true){
      productP.hidden = false;
      phares.hidden = true; 
      slid.hidden = true;
      order.hidden = true;
    }  
  }

  checkPhares(){
    let productP = document.getElementById('post-productPanel'),
        phares = document.getElementById('pharasPanel'),
        slid = document.getElementById('slidPanel'),
        order = document.getElementById('orderList');
    if(phares.hidden == true){
      productP.hidden = true;
      phares.hidden = false; 
      slid.hidden = true;
      order.hidden = true;
    }  
  }

  checkSlid(){
    let productP = document.getElementById('post-productPanel'),
        phares = document.getElementById('pharasPanel'),
        slid = document.getElementById('slidPanel'),
        order = document.getElementById('orderList');
    if(slid.hidden == true){
      productP.hidden = true;
      phares.hidden = true; 
      slid.hidden = false;
      order.hidden = true;
    }  
  }

  checkOrder() {
    let productP = document.getElementById('post-productPanel'),
        phares = document.getElementById('pharasPanel'),
        slid = document.getElementById('slidPanel'),
        order = document.getElementById('orderList');
    if(order.hidden == true){
      productP.hidden = true;
      phares.hidden = true; 
      slid.hidden = true;
      order.hidden = false;
    }  
  }
}
