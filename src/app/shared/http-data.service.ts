import { Injectable } from '@angular/core';
import { IContact } from '../db_model/contact';
import { Observable, Subject, BehaviorSubject, of, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpDataService {

  url: string = "http://localhost:3000";
  contactsSubject: Subject<IContact[]> = new Subject<IContact[]>();
  contacts: Array<IContact> = [];
  contact: IContact;
  contactSubject: Subject<IContact> = new Subject<IContact>();
  allowDetails: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  subscription: Subscription = new Subscription();

  constructor(private http: HttpClient) { }

  getContacts(): void {
    this.subscription = this.http.get<IContact[]>(`${this.url}/get`)
      .pipe(
        map(res => {
          return res
            .sort((a, b) => {
              const first = a.name.toLowerCase();
              const second = b.name.toLowerCase();
              return first < second ? -1 : first > second ? 1 : 0;
            });
        }),
      )
      .subscribe(data => {
        this.contacts = data;
        this.contactsSubject.next([...this.contacts]);
      })
  }

  insertContact(contact: IContact): Observable<IContact | null> {
    return this.http.post<IContact | null>(`${this.url}/post`, contact);
  }

  getContactsByUsername(data: string): Observable<object | null> {
    return this.http.get<object | null>(`${this.url}/get`)
      .pipe(
        map((res: IContact[]) => {
          const duplicateName = res.find(item => item.name === data);
          return duplicateName ? { usernameTaken: true } : null;
        })
      )
  }

  getContactById(id: string): Observable<IContact> {
    this.contact =  this.contacts.find(item => item.id === id);
    this.fetchObj();
    return of({...this.contact});
  }

  deleteContact(id: string): Observable<boolean> {
    return this.http.delete<any>(`${this.url}/delete/${id}`);
  }

  editContact(contact: IContact): Observable<boolean> {
    return this.http.put<boolean>(`${this.url}/put`, contact);
  }

  fetchContacts(): void {
    this.contactsSubject.next([...this.contacts]);
  }

  fetchObj(): void {
    this.contactSubject.next({...this.contact});
  }

}
