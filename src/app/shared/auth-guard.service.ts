import { Injectable } from "@angular/core";
import { RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { HttpDataService } from "./http-data.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private httpService: HttpDataService, private router: Router) {}
        
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.httpService.allowDetails.getValue()) {
            return true;
        } else {
            this.router.navigate(['']);
            return false;
        }
    }

}