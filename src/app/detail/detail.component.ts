import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpDataService } from '../shared/http-data.service';
import { Subscription, of } from 'rxjs';
import { IContact } from '../db_model/contact';
import { AnimationService } from '../shared/set-animation.service';
import { SnackbarService } from '../shared/snackbar.service';
import { DialogOpenerService } from '../shared/dialog.opener.service';
import { DialogComponent } from '../dialog/dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { concatMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {

  id: string;
  subscription: Subscription = new Subscription();
  deleteSubscription: Subscription = new Subscription();
  dialogRefSubscription: Subscription = new Subscription();
  contact: IContact;

  constructor(private activatedRoute: ActivatedRoute,
    private httpService: HttpDataService,
    private animationService: AnimationService,
    private snackbarService: SnackbarService,
    private dialog: DialogOpenerService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.subscription = this.activatedRoute.params
    .pipe(
      concatMap(param => this.httpService.getContactById(param.id))
    )
    .subscribe(data => {
      this.id = data.id;
      this.contact = data;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.deleteSubscription.unsubscribe();
    this.dialogRefSubscription.unsubscribe();
  }

  goBack(): void {
    this.animationService.setNormalState();
    const index = this.httpService.contacts.findIndex(item => item.id === this.contact.id);
    this.httpService.contacts[index] = { ...this.contact };
    this.httpService.fetchContacts();
    this.httpService.allowDetails.next(false);
    window.history.back();
  }

  deleteContact(): void {
    const confirmed = confirm('Are you sure you want to delete this contact?');
    if (confirmed) {
      this.spinner.show();
      this.deleteSubscription = this.httpService.deleteContact(this.id)
        .subscribe(_ => {
          const deletedItemIndex = this.httpService.contacts.findIndex(item => item.id === this.id);
          this.httpService.contacts.splice(deletedItemIndex, 1);
          this.httpService.contacts
            .map(item => {
              if (item['category'] === false) {
                item['category'] = undefined;
              }
            });
          this.httpService.fetchContacts();
          this.animationService.setNormalState();
          window.history.back();
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
          this.snackbarService.openSnackBar('Successfully deleted', 3000);
        })
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.openDialog(DialogComponent, of({ ...this.contact }))
    this.dialogRefSubscription = dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.contact = data;
      }
    });
  }
}
