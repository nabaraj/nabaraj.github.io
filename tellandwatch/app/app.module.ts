
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TellAndWatchComponent } from './app.component';
import { SearchHeaderComponent } from './search.header.component';
import { AdminLayoutComponent } from './adminLayout/admin-layout.component';
import { DialogComponent } from './dialog/dialog.component';
import { AppRoutes } from './app.routing';
import { CoreModule } from './core/core.module';
import { MenuItems } from './admin/admin.menu';
import { SharedModule } from './shared/shared.module';
import {AnnyangService} from './shared/services/annyang.service'

import 'hammerjs';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  declarations: [
    TellAndWatchComponent,
    SearchHeaderComponent,
    AdminLayoutComponent,
    DialogComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(AppRoutes),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    MaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule
  ],
  providers: [MenuItems, AnnyangService],
  entryComponents: [DialogComponent],
  bootstrap: [TellAndWatchComponent]
})
export class AppModule { }
