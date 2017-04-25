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
  selector: 'tenantItem',
  // styleUrls: ['./tenant-item.component.css'],
  templateUrl: './tenant-item.component.html'
})

export class TenantItemComponent extends BaseItemComponent<InterfaceProviders.Tenant> {



  @Input() myForm: FormGroup;

  constructor(
    protected datacontextService: DataContextLocal,    
    protected titleService: Title,
    protected busyIndicatorService: BusyIndicatorService,
    protected dialog: DialogService,
    protected formBuilder: FormBuilder,
    protected location: Location,
    protected restoreService: RestoreService<InterfaceProviders.Tenant>,
    protected routeParams: ActivatedRoute,
    protected router: Router,
    protected validationService: ValidationService
  ) {
    super(titleService,
      datacontextService.TenantApi,
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
    this.formMetaData = require('./tenant.metaData.json');
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
      
      concurrencyStamp: this.formMetaData.properties.concurrencyStamp ? [
          this.formMetaData.properties.concurrencyStamp['x-ncg'].defaultValue ? this.formMetaData.properties.concurrencyStamp['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.concurrencyStamp['x-ncg'].validations)
        )
      ] : null,
      
      created: this.formMetaData.properties.created ? [
          this.formMetaData.properties.created['x-ncg'].defaultValue ? this.formMetaData.properties.created['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.created['x-ncg'].validations)
        )
      ] : null,
      
      issuerValue: this.formMetaData.properties.issuerValue ? [
          this.formMetaData.properties.issuerValue['x-ncg'].defaultValue ? this.formMetaData.properties.issuerValue['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.issuerValue['x-ncg'].validations)
        )
      ] : null,
      
      name: this.formMetaData.properties.name ? [
          this.formMetaData.properties.name['x-ncg'].defaultValue ? this.formMetaData.properties.name['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.name['x-ncg'].validations)
        )
      ] : null,
      
      users: this.formMetaData.properties.users ? [
          this.formMetaData.properties.users['x-ncg'].defaultValue ? this.formMetaData.properties.users['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.users['x-ncg'].validations)
        )
      ] : null,
    });
  }

  protected customValidate() {
  }

  protected populateComponentDataAsync() {
  }
}
