import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categoryId: any;
  category: any;
  page = 1;
  product : any;
  makrs: any;
  filteredProduct: any;
  
  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    private rest: RestApiService,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.categoryId = res['id'];
      this.getProducts();
      this.product = this.getProducts();
    });
  
    try {
      const data = await this.rest.get(
        'https://localhost:3030/api/marks'
      );
      data['success']
        ? (this.makrs = data['marks'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }
  get lower() {
    return 10 * (this.page - 1) + 1;
  }
  get upper() {
    return Math.min(12 * this.page, this.category.totalProducts);
  }
  async getProducts(event?: any) {
    if (event) {
      this.category = null;
    }
    try {
      const data = await this.rest.get(
        `https://towolf.herokuapp.com/api/categories/${this.categoryId}?page=${this.page - 1}`,
      );
      data['success']
        ? (this.category = data)
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
    this.fillter();
  }

  addRevised(product) {
    this.product = product;
    this.data.revisedItems(this.product);
  }

  fillter() {
    return this.filteredProduct = this.category.products;
  }
  sort(markId: number) {
    this.fillter();
    this.filteredProduct = markId ? this.filteredProduct.filter(x=> x.mark === markId) : this.filteredProduct; 
  }

  
}
