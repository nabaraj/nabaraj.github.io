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
  selector: 'validationItem',
  // styleUrls: ['./validation-item.component.css'],
  templateUrl: './validation-item.component.html'
})

export class ValidationItemComponent extends BaseItemComponent<InterfaceProviders.Validation> {



  @Input() myForm: FormGroup;

  constructor(
    protected datacontextService: DataContextLocal,    
    protected titleService: Title,
    protected busyIndicatorService: BusyIndicatorService,
    protected dialog: DialogService,
    protected formBuilder: FormBuilder,
    protected location: Location,
    protected restoreService: RestoreService<InterfaceProviders.Validation>,
    protected routeParams: ActivatedRoute,
    protected router: Router,
    protected validationService: ValidationService
  ) {
    super(titleService,
      datacontextService.ValidationApi,
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
    this.formMetaData = require('./validation.metaData.json');
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
      
      afterDate: this.formMetaData.properties.afterDate ? [
          this.formMetaData.properties.afterDate['x-ncg'].defaultValue ? this.formMetaData.properties.afterDate['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.afterDate['x-ncg'].validations)
        )
      ] : null,
      
      age: this.formMetaData.properties.age ? [
          this.formMetaData.properties.age['x-ncg'].defaultValue ? this.formMetaData.properties.age['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.age['x-ncg'].validations)
        )
      ] : null,
      
      beforeDate: this.formMetaData.properties.beforeDate ? [
          this.formMetaData.properties.beforeDate['x-ncg'].defaultValue ? this.formMetaData.properties.beforeDate['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.beforeDate['x-ncg'].validations)
        )
      ] : null,
      
      containsDPT: this.formMetaData.properties.containsDPT ? [
          this.formMetaData.properties.containsDPT['x-ncg'].defaultValue ? this.formMetaData.properties.containsDPT['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.containsDPT['x-ncg'].validations)
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
      
      creditCard: this.formMetaData.properties.creditCard ? [
          this.formMetaData.properties.creditCard['x-ncg'].defaultValue ? this.formMetaData.properties.creditCard['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.creditCard['x-ncg'].validations)
        )
      ] : null,
      
      date: this.formMetaData.properties.date ? [
          this.formMetaData.properties.date['x-ncg'].defaultValue ? this.formMetaData.properties.date['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.date['x-ncg'].validations)
        )
      ] : null,
      
      email: this.formMetaData.properties.email ? [
          this.formMetaData.properties.email['x-ncg'].defaultValue ? this.formMetaData.properties.email['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.email['x-ncg'].validations)
        )
      ] : null,
      
      integer: this.formMetaData.properties.integer ? [
          this.formMetaData.properties.integer['x-ncg'].defaultValue ? this.formMetaData.properties.integer['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.integer['x-ncg'].validations)
        )
      ] : null,
      
      isActive: this.formMetaData.properties.isActive ? [
          this.formMetaData.properties.isActive['x-ncg'].defaultValue ? this.formMetaData.properties.isActive['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.isActive['x-ncg'].validations)
        )
      ] : null,
      
      phone: this.formMetaData.properties.phone ? [
          this.formMetaData.properties.phone['x-ncg'].defaultValue ? this.formMetaData.properties.phone['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.phone['x-ncg'].validations)
        )
      ] : null,
      
      startsWithDPT: this.formMetaData.properties.startsWithDPT ? [
          this.formMetaData.properties.startsWithDPT['x-ncg'].defaultValue ? this.formMetaData.properties.startsWithDPT['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.startsWithDPT['x-ncg'].validations)
        )
      ] : null,
      
      string: this.formMetaData.properties.string ? [
          this.formMetaData.properties.string['x-ncg'].defaultValue ? this.formMetaData.properties.string['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.string['x-ncg'].validations)
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
      
      url: this.formMetaData.properties.url ? [
          this.formMetaData.properties.url['x-ncg'].defaultValue ? this.formMetaData.properties.url['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.url['x-ncg'].validations)
        )
      ] : null,
      
      zip: this.formMetaData.properties.zip ? [
          this.formMetaData.properties.zip['x-ncg'].defaultValue ? this.formMetaData.properties.zip['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.zip['x-ncg'].validations)
        )
      ] : null,
    });
  }

  protected customValidate() {
  }

  protected populateComponentDataAsync() {
  }
}
