import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  btnDisabled = false;
  currentSettings: any;

  constructor(private data: DataService, private rest: RestApiService) { }

  async ngOnInit() {
    try {
      if (!this.data.user){
        await this.data.getProfile();
      }
      this.currentSettings = Object.assign({
        newPass: '',
        pasConfirm: ''
      }, this.data.user);
    } catch(error) {
      this.data.error(error);
    }
  }

  validate(settings){
    if (settings['name']){
      if (settings['email']){
        if (settings['newPass']){
          if (settings['pasConfirm']){
            if (settings['newPass'] === settings['pasConfirm']){
              return true;
            } else {
              this.data.error('Password do not wath');
            }
          } else {
            this.data.error('Please enter confirmat password');
          }
        } else {
          if (!settings['pasConfirm']){
            return true;
          } else {
            this.data.error('Please enter password');
          }
        }
      } else {
        this.data.error('Please enter your email');
      }
    } else {
      this.data.error('Please enter your name');
    }
  }

  async update() {
    this.btnDisabled = true;
    try {
      if(this.validate(this.currentSettings)){
        const data = await this.rest.post(
          'https://localhost:3030/api/accounts/profile',
          {
            name: this.currentSettings['name'],
            email: this.currentSettings['email'],
            password: this.currentSettings['newPass']
          }
        );

        data['success']
          ? (this.data.getProfile(), this.data['massage'])
          : (this.data.error(data['massage']));
      }
    } catch (error) {
      this.data.error(error['massage']);
    }
    this.btnDisabled = false;
  }
}
