import { Injectable } from '@angular/core';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }
  
  openSnackBar(message: string, duration: number = 2000, action?: string): void {
    const config = new MatSnackBarConfig();
    config.panelClass = ['snackbar-style'];
    config.duration = duration;
    config.horizontalPosition = 'right';
    config.verticalPosition = 'top'
    this.snackBar.open(message, action, config);
  }
}