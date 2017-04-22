// angular
import { ChangeDetectorRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlContainer, FormBuilder, FormGroup, FormsModule, NgForm,
  ReactiveFormsModule, Validator
} from '@angular/forms';
import { CanDeactivate, Router, Params } from '@angular/router';

// 3rd party
import { MdCardModule, MdCheckboxModule, MdIconModule, MdInputModule, MdRadioModule, MdButtonModule, MdProgressBarModule, MdSelectModule, MdToolbarModule } from "@angular/material";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

// providers/services
import { BusyIndicatorService } from './common/services/busyIndicator.service';
import { DialogService } from './common/services/dialog.service';
import { LocalQueryHelper } from './common/services/api/LocalQueryHelper';
import { LocalStorageService, RestoreService } from './common/services/dataStorage.service';
import { ValidationService } from './common/services/validation.service';

import { DataContext } from './services/api/rest/data-context.service';
import { DataContextLocal } from './services/api/local/data-context-local.service';
import {
   DefaultTypeAndFormatApiLocal,
   DefaultValidationApiLocal,
   NcgOtherApiLocal,
   NcgTypeAndFormatApiLocal,
   NcgValidationApiLocal,
   SomeItemApiLocal,
   TenantApiLocal,
   TypeOfTypeApiLocal,
   UserApiLocal,
   ValidationApiLocal,
} from './services/api/local';
// import { ApiProvidersLocal } from './../../services/api/local/api-providers-local';

// pipes
import { DisplayDataTransformPipe } from './common/pipes/dataTransform.pipe';
import { MapToIterablePipe } from './common/pipes/mapToIterable.pipe';
import { OrderBy } from './common/pipes/orderBy.pipe';
import { PluralTranslation } from './common/pipes/pluralTranslation.pipe';

// directives
import { InputDebounceComponent } from './common/directives/inputDebounce';

// components
import { BaseItemComponent } from './common/components/base-item.component';
import { BaseListComponent } from './common/components/base-list.component';
// import { ParentFilterAndPagingComponent } from './common/components/parent-filter-and-paging.component';
import { ParentFormComponent } from './common/components/parent-form.component';
import { ValidationMessageComponent } from './common/components/validation-message.component';

// routing
import { AdminRoutingModule, routedComponents } from './admin.routing';

@NgModule({
  declarations: [
    routedComponents,
    ParentFormComponent,
    ValidationMessageComponent,
    BaseListComponent, 
    // ParentFilterAndPagingComponent, 
    InputDebounceComponent,
    DisplayDataTransformPipe, MapToIterablePipe, OrderBy, PluralTranslation
  ],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    AdminRoutingModule,
    MdCardModule, MdCheckboxModule, MdIconModule, 
    MdInputModule, MdRadioModule, MdButtonModule, 
    MdProgressBarModule, MdSelectModule, MdToolbarModule,
    NgxDatatableModule],
  entryComponents: [routedComponents],
  providers: [
    DataContext, 
    DataContextLocal,

    DefaultTypeAndFormatApiLocal,
    DefaultValidationApiLocal,
    NcgOtherApiLocal,
    NcgTypeAndFormatApiLocal,
    NcgValidationApiLocal,
    SomeItemApiLocal,
    TenantApiLocal,
    TypeOfTypeApiLocal,
    UserApiLocal,
    ValidationApiLocal,
    //...ApiProvidersLocal,
    LocalQueryHelper,
    BusyIndicatorService, DialogService,
    FormBuilder, LocalStorageService, RestoreService, ValidationService
  ]
})
export class AdminModule { }
