import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router' 
import { RestApiService } from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  message = '';
  messageType: String;
  words: string;
  words2: string;
  user: any;
  cartItems = 0;
  time: any;
  admin: any;

  constructor(private router: Router, private rest: RestApiService) {
    this.router.events.subscribe(e => {
      if(e instanceof NavigationStart) {
        this.message = '';
      }
    })
   }

   error(message) {
     this.messageType = 'danger';
     this.message = message;
   }

   success(message) {
    this.messageType = 'success';
    this.message = message;
   }
   
   warning(massage) {
    this.messageType = 'warning';
    this.message = massage;
   }

   async getProfile() {
     try {
       if(localStorage.getItem('token')) {
         const data = await this.rest.get(
           'http://localhost:3030/api/accounts/profile'
         );
         this.user = data['user'];
       }
     } catch(error) {
       this.error(error);
     }
   }

   async getAdminka() {
    try {
      if(localStorage.getItem('token')) {
        const data = await this.rest.get(
          'http://localhost:3030/api/accounts/adminka'
        );
        this.admin = data['admin'];
      }
    } catch(error) {
      this.error(error);
    }
   }

  getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }
  addToCart(item: string) {
    const cart: any = this.getCart();
    if (cart.find(data => JSON.stringify(data) === JSON.stringify(item))) {
      return false;
    } else {
      cart.push(item);
      this.cartItems++;
      localStorage.setItem('cart', JSON.stringify(cart));
      return true;
    }
  }
  removeFromCart(item: string) {
    let cart: any = this.getCart();
    if (cart.find(data => JSON.stringify(data) === JSON.stringify(item))) {
      cart = cart.filter(data => JSON.stringify(data) !== JSON.stringify(item));
      this.cartItems--;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }
  clearCart() {
    this.cartItems = 0;
    localStorage.setItem('cart', '[]');
  }

  getRevised() {
    const revised = localStorage.getItem('revised');
    return revised ? JSON.parse(revised) : [];
  }
  revisedItems(item: string) {
    const revised: any = this.getRevised();
    if(revised.map(data => data.length <= 4)){
      if (revised.find(data => JSON.stringify(data) === JSON.stringify(item))) {
        return false;
      } else {
        revised.unshift(item);
        localStorage.setItem('revised', JSON.stringify(revised));
        return true;
      }
    }
  }

}
