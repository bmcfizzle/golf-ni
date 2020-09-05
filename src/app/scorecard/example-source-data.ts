import {DataSource} from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Hole } from '../models/hole';
import { MatPaginator } from '@angular/material';

export class ExampleDataSource extends DataSource<any> {

    private dataSubject = new BehaviorSubject<Hole[]>([]);

    data() {
      return this.dataSubject.value;
    }

    update(data) {
      this.dataSubject.next(data);
    }

    constructor(data: any[]) {
      super();
      this.dataSubject.next(data);
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Hole[]> {
      return this.dataSubject;
    }

    disconnect() {}
  }
