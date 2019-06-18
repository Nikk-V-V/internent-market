import { Component, OnInit } from '@angular/core';

import { environment } from '../../environments/environment';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  btnDisabled = false;
  handler: any;
  displayHidden = true;
  quantities = [];
  telephone = 0;
  order = {
    owner: this.data.user.name,
    city: this.data.user.address.city,
    newPostOffice: this.data.user.address.postalCode,
    email: this.data.user.email,
    telephone:  this.telephone
  }
  constructor(
    public data: DataService,
    private rest: RestApiService,
    private router: Router,
  ) {}

  trackByCartItems(index: number, item: any) {
    return item._id;
  }

  get cartItems() {
    return this.data.getCart();
  }

  get cartTotal() {
    let total = 0;
    this.cartItems.forEach((data, index) => {
      total += data['price'] * this.quantities[index];
    });
    return total;
  }

  removeProduct(index, product) {
    this.quantities.splice(index, 1);
    this.data.removeFromCart(product);
  }

  ngOnInit() {
    this.cartItems.forEach(data => {
      this.quantities.push(1);
    });
  }
  
  validate() {
    if (!this.quantities.every(data => data > 0)) {
      this.data.warning('Кількість не може бути менше одного.');
    } else if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']).then(() => {
        this.data.warning('You need to login before making a purchase.');
      });
    } else if (!this.data.user['address']) {
      this.router.navigate(['/profile/address']).then(() => {
        this.data.warning('You need to login before making a purchase.');
      });
    } else {
      this.data.message = '';
      return true;
    }
  }

  async orders() {
    let products;
        products = [];
        this.cartItems.forEach((d, index) => {
          products.push({
            product: d['_id'],
            quantity: this.quantities[index],
          });
        });
        try {
          const data = await this.rest.post(
            'https://localhost:3030/api/payment',
            {
              totalPrice: this.cartTotal,
              products,
              order: this.order
            },
          );
          data['success']
            ? (this.data.clearCart(), this.orderPanel(), this.data.success('Purchase Successful.'))
            : this.data.error(data['message']);
        } catch (error) {
          this.data.error(error['message']);
        }
        console.log(this.order)
        this.displayHidden = true;
  }

  orderPanel() {
    let div = document.getElementById('panel');
    if(div.hidden == true){
      div.hidden = false;
    } else {
      div.hidden = true;
    }
  }
}
