import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchContacts'
})
export class SearchContactsPipe implements PipeTransform {

  transform(value: any, name: string): any {
    if (name === null || value === undefined) {
      return null;
    } else {
      const filteredContacts = value.filter(contact => contact.name.toLowerCase().startsWith(name.toLowerCase()));
      filteredContacts
        .sort((a, b) => {
          const first = a.name.toLowerCase();
          const second = b.name.toLowerCase();
          return first < second ? -1 : first > second ? 1 : 0;
        })
        .forEach((item, index) => {
          // set duplicate category letter 
          if (index + 1 !== filteredContacts.length 
            && item.name.toLowerCase().charAt(0) === filteredContacts[index + 1].name.toLowerCase().charAt(0)) {
            filteredContacts[index + 1].category = false;
          }
        })
      return filteredContacts;
    }
  }

}
