import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { from } from 'rxjs';
import { RestApiService } from '../rest-api.service'; 
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  role = '';
  password = '';

  btnDisabled = false;

  constructor(
    private router: Router,
    private data: DataService,
    private rest: RestApiService,
    private app: AppComponent
  ) { }

  ngOnInit() {
  }

  formHidden() {
   return this.app.autorisationAdmin();
  }

  validate() {
    if(this.role) {
      if(this.password) {
        return true;
      } else {
        this.data.error('Password is not entered');
      }
    } else {
      this.data.error('Email is not entered');
    }
  }

  async autorisation() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        const data = await this.rest.post(
          'https://localhost:3030/api/autorisation',
          {
            role: this.role,
            password: this.password
          }
        );
        if(data['success']) {
          localStorage.setItem('token2', data['token']);
          await this.data.getProfile();
          this.router.navigateByUrl('/adminRoom');
          this.formHidden();
        } else {
          this.data.error(data['massage']);
        }
      }
    } catch (error) {
      this.data.error(error['massage']);
    }
    this.btnDisabled = false;
  }
}
