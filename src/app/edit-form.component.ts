import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Product } from './model';

@Component({
    selector: 'kendo-grid-edit-form',
    styles: [
      'input[type=text] { width: 100%; }'
    ],
    template: `
        <kendo-dialog *ngIf="active" (close)="closeForm()">
          <kendo-dialog-titlebar>
            {{ isNew ? 'Add new album' : 'Edit album' }}
          </kendo-dialog-titlebar>

            <form novalidate [formGroup]="editForm">
                <div class="form-group">
                    <label for="userId" class="control-label">User ID</label>

                    <input type="text" class="k-textbox" formControlName="userId" />

                    <div
                        class="k-tooltip k-tooltip-validation"
                        [hidden]="editForm.controls.userId.valid || editForm.controls.userId.pristine">
                        userId is required
                    </div>
                </div>
                <div class="form-group">
                <label for="id" class="control-label">ID</label>

                <input type="text" class="k-textbox" formControlName="id" />

                <div
                    class="k-tooltip k-tooltip-validation"
                    [hidden]="editForm.controls.id.valid || editForm.controls.id.pristine">
                </div>
            </div>
                <div class="form-group">
                    <label for="title" class="control-label">Title</label>

                    <input type="text" class="k-textbox" formControlName="title" />
                </div>               
            </form>

            <kendo-dialog-actions>
                <button class="k-button" (click)="onCancel($event)">Cancel</button>
                <button class="k-button k-primary" [disabled]="!editForm.valid" (click)="onSave($event)">Save</button>
            </kendo-dialog-actions>
        </kendo-dialog>
    `
})
export class GridEditFormComponent {
    public active = false;
    public editForm: FormGroup = new FormGroup({
        'userId': new FormControl(),
        'id': new FormControl(0),
        'title': new FormControl('', Validators.required),
    });

    @Input() public isNew = false;

    @Input() public set model(product: Product) {
        this.editForm.reset(product);

        this.active = product !== undefined;
    }

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<Product> = new EventEmitter();

    public onSave(e): void {
        e.preventDefault();
        this.save.emit(this.editForm.value);
        this.active = false;
    }

    public onCancel(e): void {
        e.preventDefault();
        this.closeForm();
    }

    private closeForm(): void {
        this.active = false;
        this.cancel.emit();
    }
}
