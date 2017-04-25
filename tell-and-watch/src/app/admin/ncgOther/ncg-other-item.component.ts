// angular
import { Component, Input, OnInit } from '@angular/core';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, CanDeactivate, Params, Router } from '@angular/router';

// api
import * as InterfaceProviders from './../services/api/models/interface-providers';

// providers/services
import { BusyIndicatorService } from './../common/services/busyIndicator.service';
import { DialogService } from './../common/services/dialog.service';
import { LocalStorageService, RestoreService } from './../common/services/dataStorage.service';
import { ValidationService } from './../common/services/validation.service';

import { DataContext } from './../services/api/rest/data-context.service';
import { DataContextLocal } from './../services/api/local/data-context-local.service';

// components
import { BaseItemComponent } from './../common/components/base-item.component';
import { ParentFormComponent } from './../common/components/parent-form.component';
import { ValidationMessageComponent } from './../common/components/validation-message.component';

// other
import * as moment from 'moment';

@Component({
  selector: 'ncgOtherItem',
  // styleUrls: ['./ncg-other-item.component.css'],
  templateUrl: './ncg-other-item.component.html'
})

export class NcgOtherItemComponent extends BaseItemComponent<InterfaceProviders.NcgOther> {



  @Input() myForm: FormGroup;

  constructor(
    protected datacontextService: DataContextLocal,    
    protected titleService: Title,
    protected busyIndicatorService: BusyIndicatorService,
    protected dialog: DialogService,
    protected formBuilder: FormBuilder,
    protected location: Location,
    protected restoreService: RestoreService<InterfaceProviders.NcgOther>,
    protected routeParams: ActivatedRoute,
    protected router: Router,
    protected validationService: ValidationService
  ) {
    super(titleService,
      datacontextService.NcgOtherApi,
      busyIndicatorService,
      dialog,
      formBuilder,
      location,
      restoreService,
      routeParams,
      router,
      validationService
    );
    
  }

  buildForm(): void {
    this.formMetaData = require('./ncg-other.metaData.json');
    this.normalizeFormMetaData();
    this.addFormValidation();

    this.myForm.valueChanges
      .subscribe(
        data => this.onValueChanged(data)
      );

    this.onValueChanged(); // (re)set validation messages now
  }

  private addFormValidation() {
    this.myForm = this.formBuilder.group({
      
      id: this.formMetaData.properties.id ? [
          this.formMetaData.properties.id['x-ncg'].defaultValue ? this.formMetaData.properties.id['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.id['x-ncg'].validations)
        )
      ] : null,
      
      itemNotDisplayed: this.formMetaData.properties.itemNotDisplayed ? [
          this.formMetaData.properties.itemNotDisplayed['x-ncg'].defaultValue ? this.formMetaData.properties.itemNotDisplayed['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.itemNotDisplayed['x-ncg'].validations)
        )
      ] : null,
      
      itemNotGenerated: this.formMetaData.properties.itemNotGenerated ? [
          this.formMetaData.properties.itemNotGenerated['x-ncg'].defaultValue ? this.formMetaData.properties.itemNotGenerated['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.itemNotGenerated['x-ncg'].validations)
        )
      ] : null,
      
      listNotDisplayed: this.formMetaData.properties.listNotDisplayed ? [
          this.formMetaData.properties.listNotDisplayed['x-ncg'].defaultValue ? this.formMetaData.properties.listNotDisplayed['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.listNotDisplayed['x-ncg'].validations)
        )
      ] : null,
      
      listNotGenerated: this.formMetaData.properties.listNotGenerated ? [
          this.formMetaData.properties.listNotGenerated['x-ncg'].defaultValue ? this.formMetaData.properties.listNotGenerated['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.listNotGenerated['x-ncg'].validations)
        )
      ] : null,
      
      orderAThird: this.formMetaData.properties.orderAThird ? [
          this.formMetaData.properties.orderAThird['x-ncg'].defaultValue ? this.formMetaData.properties.orderAThird['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.orderAThird['x-ncg'].validations)
        )
      ] : null,
      
      orderBSecond: this.formMetaData.properties.orderBSecond ? [
          this.formMetaData.properties.orderBSecond['x-ncg'].defaultValue ? this.formMetaData.properties.orderBSecond['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.orderBSecond['x-ncg'].validations)
        )
      ] : null,
      
      orderCFirst: this.formMetaData.properties.orderCFirst ? [
          this.formMetaData.properties.orderCFirst['x-ncg'].defaultValue ? this.formMetaData.properties.orderCFirst['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.orderCFirst['x-ncg'].validations)
        )
      ] : null,
      
      withTitleDescDefaultMetaData: this.formMetaData.properties.withTitleDescDefaultMetaData ? [
          this.formMetaData.properties.withTitleDescDefaultMetaData['x-ncg'].defaultValue ? this.formMetaData.properties.withTitleDescDefaultMetaData['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.withTitleDescDefaultMetaData['x-ncg'].validations)
        )
      ] : null,
    });
  }

  protected customValidate() {
  }

  protected populateComponentDataAsync() {
  }
}
