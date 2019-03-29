import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpDataService } from '../shared/http-data.service';
import { Observable, Subscription } from 'rxjs';
import { IContact } from '../db_model/contact';
import { AnimationService } from '../shared/set-animation.service';
import { SnackbarService } from '../shared/snackbar.service';
import { DialogOpenerService } from '../shared/dialog.opener.service';
import { DialogComponent } from '../dialog/dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  id: string;
  subscription: Subscription = new Subscription();
  contact$: Observable<IContact>;

  constructor(private activatedRoute: ActivatedRoute,
    private http: HttpDataService,
    private animationService: AnimationService,
    private snackbarService: SnackbarService,
    private dialog: DialogOpenerService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(data => {
      this.id = data.id;
      this.contact$ = this.http.getContactById(this.id);
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goBack(): void {
    this.animationService.setNormalState();
    window.history.back();
  }

  deleteContact(): void {
    const confirmed = confirm('Are you sure you want to delete this contact?');
    if (confirmed) {
      this.spinner.show();
      this.http.deleteContact(this.id)
      .subscribe(_ => {
        this.animationService.setNormalState();
        window.history.back();
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
        this.snackbarService.openSnackBar('Successfully deleted', 3000);
      })
    } else {
      return;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.openDialog(DialogComponent, this.contact$ );
    dialogRef.afterClosed().subscribe(data => {
      // fetch data from server only when from is submitted
      data === undefined ? {} : data['state'];
      if (data) {
        this.contact$ = this.http.getContactById(this.id);
      }
    });
  }
}
