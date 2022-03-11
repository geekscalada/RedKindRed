import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataService {

  messageSubject = new Subject();

  sendMessage(message: any){
    this.messageSubject.next(message)
  }


  constructor() { }
}
