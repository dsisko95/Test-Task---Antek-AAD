import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpDataService } from '../shared/http-data.service';
import { SnackbarService } from '../shared/snackbar.service';
import { ValidateUsername } from '../unique-username-validator';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {

  contactForm: FormGroup;
  tagCounter: number = 0;
  contact: any;
  subscription: Array<Subscription> = new Array<Subscription>();

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    private formBuilder: FormBuilder,
    private httpService: HttpDataService,
    private snackbarService: SnackbarService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    this.contactForm = this.formBuilder.group({
      'id': [null],
      'name': [null, [Validators.required]],
      'email': [null, [Validators.required, Validators.email]],
      'number': [null, [Validators.required, Validators.pattern(/^\d\d\d-\d{7}$/)]],
      'tags': this.formBuilder.array([])
    })

    // get dialog data obj
    this.subscription.push(this.data.subscribe(data => {
      if (!data) {
        // set async validator
        this.contactForm.controls['name'].setAsyncValidators(ValidateUsername.createValidator(this.httpService));
        return;
      }
      this.contact = data;
      this.contact.editState = true;
      this.contactForm.patchValue({
        'id': this.contact.id,
        'name': this.contact.name,
        'email': this.contact.email,
        'number': this.contact.number
      })
      // add tags
      this.contact.tags.forEach(tag => {
        const control = new FormControl(tag, Validators.required);
        (<FormArray>this.contactForm.get('tags')).push(control);
        this.tagCounter += 1;
      })

    }));
  }

  ngOnDestroy() {
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }

  onNoClick(e: Event): void {
    e.preventDefault();
    this.dialogRef.close();
  }

  addContact(): void {
    if (this.contactForm.invalid) {
      return;
    } else {
      // reset whitespace on beginning
      this.contactForm.patchValue({
        'name': (<String>this.contactForm.get('name').value).trim(),
        'email': (<String>this.contactForm.get('email').value).trim()
      });
      // add state
      if (this.contact === undefined || !this.contact.editState) {
        this.spinner.show();
        this.subscription.push(this.httpService.insertContact(this.contactForm.value)
          .subscribe(data => {
            this.httpService.contacts.push(data);
            this.httpService.fetchContacts();
            this.dialogRef.close();
            setTimeout(() => {
              this.spinner.hide();
            }, 500);
            this.snackbarService.openSnackBar('Successfully added', 3000);
          }));
      }
      // edit state
      else {
        this.spinner.show();
        this.subscription.push(this.httpService.editContact(this.contactForm.value)
          .subscribe(_ => {
            this.data = { ...this.contactForm.value };
            this.dialogRef.close(this.data);
            setTimeout(() => {
              this.spinner.hide();
            }, 500);
            this.snackbarService.openSnackBar('Successfully edited', 3000);
          }));

      }
    }
  }

  addTag(e: Event): void {
    e.preventDefault();
    if (this.tagCounter > 1) {
      return;
    }
    this.tagCounter += 1;
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.contactForm.get('tags')).push(control);
  }

}
