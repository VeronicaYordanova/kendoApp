import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Inject } from '@angular/core';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

import { Product } from './model';
import { EditService } from './edit.service';

import { map } from 'rxjs/operators/map';

@Component({
  selector: 'app-root',
  styles: [
    'input[type=text] { width: 100%; }'
  ],
  template: `
  <kendo-grid
  [data]="view | async"
  [height]="533"
  [pageSize]="gridState.take" [skip]="gridState.skip" [sort]="gridState.sort"
  [pageable]="true" [sortable]="true"
  (dataStateChange)="onStateChange($event)"
  (edit)="editHandler($event)" (remove)="removeHandler($event)"
  (add)="addHandler($event)"
  >
  <ng-template kendoGridToolbarTemplate>
    <button kendoGridAddCommand>Add new</button>
  </ng-template>
  <kendo-grid-column field="userId" title="User ID"></kendo-grid-column>
  <kendo-grid-column field="id" title="ID"></kendo-grid-column>
  <kendo-grid-column field="title" title="Title"></kendo-grid-column>
  <kendo-grid-command-column title="command" width="220">
    <ng-template kendoGridCellTemplate>
        <button kendoGridEditCommand [primary]="true">Edit</button>
        <button kendoGridRemoveCommand>Delete</button>
    </ng-template>
  </kendo-grid-command-column>
  </kendo-grid>
  
  <kendo-grid-edit-form [model]="editDataItem" [isNew]="isNew"
  (save)="saveHandler($event)"
  (cancel)="cancelHandler()">
  </kendo-grid-edit-form>
  `

})
export class AppComponent implements OnInit {
  public view: Observable<GridDataResult>;
  public gridState: State = {
      sort: [],
      skip: 0,
      take: 10
  };

  public editDataItem: Product;
  public isNew: boolean;
  private editService: EditService;

  constructor(@Inject(EditService) editServiceFactory: any) {
      this.editService = editServiceFactory();
  }

  public ngOnInit(): void {
      this.view = this.editService.pipe(map(data => process(data, this.gridState)));

      this.editService.read();
  }

  public onStateChange(state: State) {
      this.gridState = state;

      this.editService.read();
  }

  public addHandler() {
      this.editDataItem = new Product();
      this.isNew = true;
  }

  public editHandler({dataItem}) {
      this.editDataItem = dataItem;
      this.isNew = false;
  }

  public cancelHandler() {
      this.editDataItem = undefined;
  }

  public saveHandler(product: Product) {
      this.editService.save(product, this.isNew);

      this.editDataItem = undefined;
  }

  public removeHandler({dataItem}) {
      this.editService.remove(dataItem);
  }
}
