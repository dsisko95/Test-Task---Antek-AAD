import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { SnackbarService } from './snackbar.service';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private snackbarService: SnackbarService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error on client side: ${error.error.message}`;
          } else {
            // server-side error
            errorMessage = `Status: ${error.status}\nError on server side: ${error.message}`;
          }
          this.snackbarService.openSnackBar(errorMessage, 3000);
          return throwError(errorMessage);
        })
      )
  }
}