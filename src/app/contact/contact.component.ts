import { Component, OnInit } from '@angular/core';
import { HttpDataService } from '../shared/http-data.service';
import { Observable, of } from 'rxjs';
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
export class ContactComponent implements OnInit {

  contacts$: Observable<IContact[]>;
  searchString: string = '';

  constructor(private httpService: HttpDataService,
    private dialog: DialogOpenerService,
    private router: Router,
    private animationService: AnimationService ) { }

  ngOnInit() {
    this.contacts$ = this.httpService.getContacts();
  }

  openDialog(): void {
    const dialogRef = this.dialog.openDialog(DialogComponent, of({}));
    dialogRef.afterClosed().subscribe(data => {
      // fetch data from server only when from is submitted
      data === undefined ? {} : data['state'];
      if (data) {
        this.contacts$ = this.httpService.getContacts();
      }
    });
  }

  searchedName(e: any): void {
    this.searchString = e.target.value;
  }

  editContact(id: string): void {
    this.animationService.setMinimizedState();
    this.router.navigate(['details/', id]);
  }

}
