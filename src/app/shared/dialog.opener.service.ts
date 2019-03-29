import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class DialogOpenerService {

  constructor(public dialog: MatDialog) { }

  openDialog(component: any, data?: any, width: string = '500', height: string = '500'): any {
    const dialogRef = this.dialog.open(component, {
      width: `${width}px`,
      height: `${height}px`,
      data
    });
    return dialogRef;
  }

}