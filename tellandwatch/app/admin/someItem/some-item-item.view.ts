
import { browser, by, element, protractor } from 'protractor';
import { WebElement } from '@types/selenium-webdriver';
import { AdminView } from '../admin.view';
import { SomeItemListView } from './some-item-list.view';
import { SomeItem } from '../services/api/models/some-item';
import { ValidationService } from '../common/services/validation.service';
import { e2eHelper } from '../common/e2eHelper';

export class SomeItemItemView {
  adminView = new AdminView();
  someItemListView = new SomeItemListView();
  validationService = new ValidationService();
  helper = new e2eHelper();
  metaData = require('./some-item.metaData.json');

  //--Elements--
  cancelButton = element(by.id('cancelButton'));
  submitButton = element(by.id('submitButton'));
  backButton = element(by.id('backButton'));

  getValidationMessage(fieldKey: string, validationType: string): string {
    let validationMessage = '';
    validationMessage = this.metaData.properties[fieldKey]['x-ncg'].validations[validationType].message ? this.metaData.properties[fieldKey]['x-ncg'].validations[validationType].message :
      ValidationService.getGenericValidationMessage(fieldKey, validationType, this.metaData);

    return validationMessage;
  }

  getValidationMessageFinderString(fieldKey: string): string {
    let elementFinderString = '//*[@id="' + fieldKey + 'Input"]';
    let validationMessageFinderString = elementFinderString + '/following-sibling::*';
    return validationMessageFinderString;
  }

  generateValidationData(fieldKey: string, validationType: string): string {
    let testData: string = '';
    let validationValue = this.metaData.properties[fieldKey]['x-ncg'].validations[validationType].value;

    switch (validationType) {
      case 'required':
        testData = '';
        break;
      case 'minLength':
        if (validationValue > 1)
          testData = 'a';
        else testData = '';
        break;
      case 'maxLength':
        for (let i = 0; i <= validationValue; i++) {
          testData = 'a'.repeat(validationValue + 1);
        }
        break;
      case 'pattern':
        testData = '!Ả他あ invalid pattern';
        break;
      case 'maximum':
        testData = (Number(validationValue) + 1).toString();
        break;
      case 'minimum':
        testData = (Number(validationValue) - 1).toString();
        break;
      default:
        break;
    }

    return testData;
  }

  sendValidationData(fieldKey: string, validationType: string): void {
    let elementFinderString = '//*[@id="' + fieldKey + 'Input"]';
    let control = element(by.xpath(elementFinderString));

    control.clear();

    switch (validationType) {
      case 'required':
        this.clearContent(control);
        control.sendKeys('');
        break;
      case 'minLength':
      case 'maxLength':
      case 'pattern':
        control.sendKeys(this.generateValidationData(fieldKey, validationType));
        break;
    }
  }

  clearContent(control: any) {
    control.clear();
    control.sendKeys(' ');
    control.sendKeys(protractor.Key.BACK_SPACE);
  }

  sendDataToControl(item: any, key: any): void {
    let control = element(by.id(key + 'Input'));
    switch (key.toString()) {
      case 'bit':
      case 'isActive':
        control.getWebElement().then((controlElement) => {
          this.updateCheckboxValue(controlElement, item[key]);
        });
        break;
      case 'date':
      case 'createdDate':
      case 'updatedDate':
        {
          let convertedDate = this.helper.convertToSomeDateFormat('mmddyyyy', item[key]);
          control.click();
          control.sendKeys(convertedDate);
          break;
        }
      default:
        {
          control.clear();
          control.sendKeys(item[key]);
          break;
        }
    }
  }

  updateCheckboxValue(checkboxControl: WebElement, intendedValue: boolean) {
    checkboxControl.getAttribute('ng-reflect-model').then((value) => {
      if (intendedValue.toString() != value) {
        checkboxControl.click();
      }
    })
  }

  createNewItem(item: any): void {
    this.someItemListView.addButton.click();
    Object.keys(item).forEach((key) => {
      this.sendDataToControl(item, key);
    });

    this.submitButton.click();
  }

  editFirstItemInList(): void {
    element(by.id('editButton')).click();
  }

  editItem(item: any): void {
    this.editFirstItemInList();
    Object.keys(item).forEach((key) => {
      this.sendDataToControl(item, key);
    });
    this.submitButton.click();
  }

  deleteFirstItemInView(): void {
    element(by.id('deleteButton')).click().then(() => {
      browser.switchTo().alert().accept();
    });
  }

  checkValidationMessage(webElement: any, validationMessage: string): Promise<{}> {
    let isMatched: boolean = false;

    return new Promise((resolve) => {
      webElement.getText().then((text) => {
        if (text === validationMessage) {
          isMatched = true;
        }
        else {
          isMatched = false;
        }

        resolve(isMatched);
      });
    });
  }

  checkValidation(validationMessage: string, messageFinderString: string): any {
    let messageArray = [];
    let numberOfMessages: number;
    let promises = [];

    return element.all(by.xpath(messageFinderString)).then((arr) => {
      messageArray = arr;
      numberOfMessages = arr.length;
      return arr;
    }).then(() => {
      for (let i = 0; i < numberOfMessages; i++) {
        promises.push(this.checkValidationMessage(messageArray[i], validationMessage));
      }
    }).then(() => {
      Promise.all(promises).then((results) => {
        return results.some(item => item === true);
      });
    });
  }

  isSubmitButtonDisabled(): any {
    return this.submitButton.isEnabled().then((result) => {
      return !result;
    });
  }

  checkIfUniqueId(list, id): boolean {
    let result = false;
    let invalid = 0;

    list.forEach((item) => {
      if (item.id == id.toString()) {
        invalid++;
      }
    });

    result = invalid == 0 ? true : false;
    return result;
  }

  generateUniqueId(list): number {
    let listLength = Object.keys(list).length;
    let i = 1;

    while (i <= listLength) {
      if (this.checkIfUniqueId(list, i)) {
        return i;
      }
      else {
        i++;
      }
    }

    return ++listLength;
  }
}
