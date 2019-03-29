import { Injectable } from '@angular/core';
import { IContact } from '../db_model/contact';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpDataService {
  url: string = "http://localhost:3000";

  constructor(private http: HttpClient) { }

  getContacts(): Observable<IContact[]> {
    return this.http.get<IContact[]>(`${this.url}/get`)
      .pipe(
        map(res => {
          return res
            .sort((a, b) => {
              const first = a.name.toLowerCase();
              const second = b.name.toLowerCase();
              return first < second ? -1 : first > second ? 1 : 0;
            });
        }),
        shareReplay()
      )
  }

  insertContact(contact: IContact): Observable<boolean> {
    return this.http.post<boolean>(`${this.url}/post`, contact);
  }

  getContactsByUsername(data: string): any {
    return this.http.get<IContact[]>(`${this.url}/get`)
      .pipe(
        map(res => {
          const filteredArr = res.filter(item => item.name === data);
          return filteredArr.length === 0 ? null : { usernameTaken: true };
        })
      )
  }

  getContactById(id: string): Observable<any> {
    return this.http.get<IContact[]>(`${this.url}/get`)
      .pipe(
        map(res => res.find(item => item.id === id)),
        shareReplay()
      );
  }

  deleteContact(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.url}/delete/${id}`);
  }

  editContact(contact: IContact): Observable<boolean> {
    return this.http.put<boolean>(`${this.url}/put`, contact);
  }

}
