import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpDataService } from '../shared/http-data.service';
import { of, Subscription } from 'rxjs';
import { IContact } from '../db_model/contact';
import { DialogOpenerService } from '../shared/dialog.opener.service';
import { DialogComponent } from '../dialog/dialog.component';
import { Router } from '@angular/router';
import { AnimationService } from '../shared/set-animation.service';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {

  contacts: Array<IContact>;
  searchString: string = '';
  subscription: Subscription = new Subscription();
  togglePanel: boolean = false;

  constructor(private httpService: HttpDataService,
    private dialog: DialogOpenerService,
    private router: Router,
    private animationService: AnimationService) { }

  ngOnInit() {
    this.subscription = this.httpService.contactsSubject
      .subscribe(data => {
        this.contacts = data;
      })
    this.httpService.fetchContacts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.openDialog(DialogComponent, of(null));
  }

  searchedName(e: any): void {
    this.searchString = e.target.value;
  }

  editContact(id: string): void {
    this.animationService.setMinimizedState();
    this.router.navigate(['details/', id]);
    this.httpService.allowDetails.next(true);
  }

  togglePanelState(): void {
    this.togglePanel = !this.togglePanel;
  }

}
