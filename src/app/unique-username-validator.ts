import { AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpDataService } from './shared/http-data.service';
import { Observable } from 'rxjs';

export class ValidateUsername {
    static createValidator(http: HttpDataService) {
        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            return http.getContactsByUsername(control.value);
        }
    }
}