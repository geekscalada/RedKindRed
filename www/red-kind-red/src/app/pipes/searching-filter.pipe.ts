// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({ name: 'appSearchFilter' })
// export class FilterPipe implements PipeTransform {
//   /**
//    * Pipe filters the list of elements based on the search text provided
//    *
//    * @param items list of elements to search in
//    * @param searchText search string
//    * @returns list of elements filtered by search text or []
//    */
    

//   transform(items: any[], searchText: String): any[] {
//     if (!items) {
//       return [];
//     }
//     // if (!searchText) {
//     //   return items;
//     // }
    
//     searchText = searchText.toLocaleLowerCase();

//     if (items) {
//         console.log('hola q ase');
//     }


//     return items.filter(it => {
//       return it.toLocaleLowerCase().includes(searchText);
//     });
//   }
// }



// @Pipe({
//     name: 'searchText',
//     pure: false
// })
// export class FilterPipe implements PipeTransform {
//     transform(items: any[], searchText: (item: any) => boolean): any {
//         if (!items || !searchText) {
//             return items;
//         }
//         return items.filter(item => searchText(item));
//     }
// }

import { PipeTransform, Pipe } from '@angular/core';

// @Pipe({
//     name: 'callback',
//     pure: false
// })
// export class CallbackPipe implements PipeTransform {
//     transform(items: any[], callback: (item: any) => boolean): any {
//         if (!items || !callback) {
//             return items;
//         }
//         return items.filter(item => callback(item));
//     }
// }

@Pipe({
    name: 'filter'
})

//filterPipe por lo visto ya tiene comportamiento de like %%
export class FilterPipe implements PipeTransform{

    transform(value: any, arg: any): any {
        
        const resultUsers = []

        for (const user of value) {
            if (user.name.toLocaleLowerCase().indexOf(arg.toLocaleLowerCase()) > -1) {
                resultUsers.push(user)
            }
        }
        
        return resultUsers
    }

}