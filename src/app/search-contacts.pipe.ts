import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchContacts'
})
export class SearchContactsPipe implements PipeTransform {

  transform(value: any, name: string): any {
    if (value === null || name === null) {
      return null;
    } else {
      const filteredContacts = value.filter(contact => contact.name.toLowerCase().startsWith(name.toLowerCase()));
      filteredContacts
        .forEach((item, index) => {
          // set duplicate category letter state
          if (index + 1 !== filteredContacts.length && item.name.toLowerCase().charAt(0) === filteredContacts[index + 1].name.toLowerCase().charAt(0)) {
            filteredContacts[index + 1].category = false;
          }
        })
      return filteredContacts;
    }
  }

}
