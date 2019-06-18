import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

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
  btnDisabled = false;
  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router
  ) { }

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        'https://localhost:3030/api/accounts/profile/api/categories'
      );
      data['success']
        ? (this.categories = data['categories'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
    try {
      const data = await this.rest.get(
        'https://localhost:3030/api/accounts/profile/api/marks'
      );
      data['success']
        ? (this.marks = data['marks'])
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
          'https://localhost:3030/api/accounts/profile/api/seller/products',
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

}
