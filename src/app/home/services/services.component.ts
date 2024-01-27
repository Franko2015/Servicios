import { Component, OnInit, OnChanges } from '@angular/core';
import { TraductorService } from '../../Servicios/traductor.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent{

  idioma = ""
  tituloArriba = ""

  constructor(private traductor: TraductorService, private trad: TranslateService) {}

  changeLanguage(lang: string) {
    this.traductor.changeLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  getTranslation(key: string) {
    return this.trad.instant(key);
  }


}
