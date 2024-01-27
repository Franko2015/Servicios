import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateLoader, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TraductorService {

  constructor(private translateService: TranslateService) {

  }

  getTranslation(key: string) {
    return this.translateService.instant(key);
  }

  changeLanguage(lang: string) {
    this.translateService.use(lang);
  }
  
}


