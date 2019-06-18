import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: any;
  phrases: any;
  time: any;
  currentPhrases: any;
  phras1: any;
  phras2: any;
  phras3: any;
  phras4: any;

  constructor(
    private rest:RestApiService,
    private data: DataService 
  ) { }

  async ngOnInit() {
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
    this.phrasesWolf();
    this.timeWords();
  }

  timeWords() {
    this.time = setInterval((x) => {
      this.woolfWords();
      clearInterval(this.time);
      this.timeWords();
    },10000)
  }

  phrasesWolf(){
    this.phras1 = this.currentPhrases.phras1;
    this.phras2 = this.currentPhrases.phras2;
    this.phras3 = this.currentPhrases.phras3;
    this.phras4 = this.currentPhrases.phras4;
    this.phrases = this.phras1;
  }
  woolfWords() {
    if(this.phrases == this.phras1){
      this.phrases = this.phras2;
    } else if(this.phrases == this.phras2) {
      this.phrases = this.phras3;
    } else if(this.phrases == this.phras3) {
      this.phrases = this.phras4;
    } else if (this.phrases ==  this.phras4) {
      this.phrases =   this.phras1; 
    }
  }
 

}
