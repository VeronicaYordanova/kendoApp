import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { tap } from 'rxjs/operators/tap';
import { map } from 'rxjs/operators/map';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

@Injectable()
export class EditService extends BehaviorSubject<any[]> {
    constructor(private http: HttpClient) {
        super([]);
    }

    private data: any[] = [];

    public read() {
        if (this.data.length) {
            return super.next(this.data);
        }

        this.fetch()
            .pipe(
                tap(data => {
                    this.data = data;
                })
            )
            .subscribe(data => {
                super.next(data);
            });
    }

    public save(data: any, isNew?: boolean) {
        const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

        if (isNew) {
          this.data.push(data);
        } else {
          let index = this.data.findIndex(element => element.id === data.id);
          this.data[index] = data;
        }

        this.read();
    }

    public remove(data: any) {
        let index = this.data.findIndex(element => element.id === data.id);
        this.data.splice(index, 1);
        this.read();
    }

    public resetItem(dataItem: any) {
        if (!dataItem) { return; }

        // find orignal data item
        const originalDataItem = this.data.find(item => item.userId === dataItem.userId);

        // revert changes
        Object.assign(originalDataItem, dataItem);

        super.next(this.data);
    }

    private fetch(action: string = '', data?: any): Observable<any[]> {
        return this.http.get('https://jsonplaceholder.typicode.com/albums').pipe(map(res => <any[]>res));
     }

}