import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private apiUrl = 'https://restcountries.com/v3.1/all?fields=name';

  constructor(private http: HttpClient) { }

  getPaises(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(countries => countries.sort((a, b) => a.name.common.localeCompare(b.name.common)))
    );
  }


}
