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
  selector: 'typeOfTypeItem',
  // styleUrls: ['./type-of-type-item.component.css'],
  templateUrl: './type-of-type-item.component.html'
})

export class TypeOfTypeItemComponent extends BaseItemComponent<InterfaceProviders.TypeOfType> {



  @Input() myForm: FormGroup;

  constructor(
    protected datacontextService: DataContextLocal,    
    protected titleService: Title,
    protected busyIndicatorService: BusyIndicatorService,
    protected dialog: DialogService,
    protected formBuilder: FormBuilder,
    protected location: Location,
    protected restoreService: RestoreService<InterfaceProviders.TypeOfType>,
    protected routeParams: ActivatedRoute,
    protected router: Router,
    protected validationService: ValidationService
  ) {
    super(titleService,
      datacontextService.TypeOfTypeApi,
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
    this.formMetaData = require('./type-of-type.metaData.json');
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
      
      abbreviation: this.formMetaData.properties.abbreviation ? [
          this.formMetaData.properties.abbreviation['x-ncg'].defaultValue ? this.formMetaData.properties.abbreviation['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.abbreviation['x-ncg'].validations)
        )
      ] : null,
      
      createdBy: this.formMetaData.properties.createdBy ? [
          this.formMetaData.properties.createdBy['x-ncg'].defaultValue ? this.formMetaData.properties.createdBy['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.createdBy['x-ncg'].validations)
        )
      ] : null,
      
      createdDate: this.formMetaData.properties.createdDate ? [
          this.formMetaData.properties.createdDate['x-ncg'].defaultValue ? this.formMetaData.properties.createdDate['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.createdDate['x-ncg'].validations)
        )
      ] : null,
      
      isActive: this.formMetaData.properties.isActive ? [
          this.formMetaData.properties.isActive['x-ncg'].defaultValue ? this.formMetaData.properties.isActive['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.isActive['x-ncg'].validations)
        )
      ] : null,
      
      key: this.formMetaData.properties.key ? [
          this.formMetaData.properties.key['x-ncg'].defaultValue ? this.formMetaData.properties.key['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.key['x-ncg'].validations)
        )
      ] : null,
      
      name: this.formMetaData.properties.name ? [
          this.formMetaData.properties.name['x-ncg'].defaultValue ? this.formMetaData.properties.name['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.name['x-ncg'].validations)
        )
      ] : null,
      
      order: this.formMetaData.properties.order ? [
          this.formMetaData.properties.order['x-ncg'].defaultValue ? this.formMetaData.properties.order['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.order['x-ncg'].validations)
        )
      ] : null,
      
      parentID: this.formMetaData.properties.parentID ? [
          this.formMetaData.properties.parentID['x-ncg'].defaultValue ? this.formMetaData.properties.parentID['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.parentID['x-ncg'].validations)
        )
      ] : null,
      
      typeID: this.formMetaData.properties.typeID ? [
          this.formMetaData.properties.typeID['x-ncg'].defaultValue ? this.formMetaData.properties.typeID['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.typeID['x-ncg'].validations)
        )
      ] : null,
      
      uid: this.formMetaData.properties.uid ? [
          this.formMetaData.properties.uid['x-ncg'].defaultValue ? this.formMetaData.properties.uid['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.uid['x-ncg'].validations)
        )
      ] : null,
      
      updatedBy: this.formMetaData.properties.updatedBy ? [
          this.formMetaData.properties.updatedBy['x-ncg'].defaultValue ? this.formMetaData.properties.updatedBy['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.updatedBy['x-ncg'].validations)
        )
      ] : null,
      
      updatedDate: this.formMetaData.properties.updatedDate ? [
          this.formMetaData.properties.updatedDate['x-ncg'].defaultValue ? this.formMetaData.properties.updatedDate['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.updatedDate['x-ncg'].validations)
        )
      ] : null,
      
      value: this.formMetaData.properties.value ? [
          this.formMetaData.properties.value['x-ncg'].defaultValue ? this.formMetaData.properties.value['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.value['x-ncg'].validations)
        )
      ] : null,
    });
  }

  protected customValidate() {
  }

  protected populateComponentDataAsync() {
  }
}
