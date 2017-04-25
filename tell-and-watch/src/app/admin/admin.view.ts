
import { browser, by, element } from 'protractor';
import { e2eHelper } from './common/e2eHelper';

export class AdminView {
  helper = new e2eHelper();

  //--Navigation--
  goToAdminView(): void {
    browser.get(browser.baseUrl + '#/admin');
  }

  goToDefaultTypeAndFormatView(): void {
    element(by.linkText('Default Type And Format')).click();
  }

  goToDefaultValidationView(): void {
    element(by.linkText('Default Validation')).click();
  }

  goToNcgOtherView(): void {
    element(by.linkText('Ncg Other')).click();
  }

  goToNcgTypeAndFormatView(): void {
    element(by.linkText('Ncg Type And Format')).click();
  }

  goToNcgValidationView(): void {
    element(by.linkText('Ncg Validation')).click();
  }

  goToSomeItemView(): void {
    element(by.linkText('Some Item')).click();
  }

  goToTenantView(): void {
    element(by.linkText('Tenant')).click();
  }

  goToTypeOfTypeView(): void {
    element(by.linkText('Type Of Type')).click();
  }

  goToUserView(): void {
    element(by.linkText('User')).click();
  }

  goToValidationView(): void {
    element(by.linkText('Validation')).click();
  }
}
