
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { TypeOfTypeListView } from './type-of-type-list.view';
import { TypeOfTypeItemView } from './type-of-type-item.view';
import { TypeOfType } from '../services/api/models/type-of-type';
import { ValidationService } from '../common/services/validation.service';
import { e2eHelper } from '../common/e2eHelper';
import * as changeCase from 'change-case';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let typeOfTypeListView = new TypeOfTypeListView();
    let typeOfTypeItemView = new TypeOfTypeItemView();
    let jsonItemData = require('../services/api/local/TypeOfType.json');
    let metaData = require('./type-of-type.metaData.json');

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToTypeOfTypeView();
    });

    it('can add an item', () => {
      typeOfTypeListView.getRecordCount().then((recordCount) => {
        // get the list and first item in the list
        let list = jsonItemData.value;
        let item = jsonItemData.value[0];

        // copy value of the first item to a new variable
        let newItem = JSON.parse(JSON.stringify(item));

        // assign new unique id for the new item
        newItem.id = typeOfTypeItemView.generateUniqueId(list);

        // update the list
        list.push(newItem);

        typeOfTypeItemView.createNewItem(newItem);

        typeOfTypeListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount) + 1);
        });
      });
    });

    it('can edit an item', () => {
      // get the list and first item in the list
      let list = jsonItemData.value;
      let item = jsonItemData.value[0];

      // update id for the first item
      item.id = typeOfTypeItemView.generateUniqueId(list);

      typeOfTypeItemView.editItem(item);

      // filter records, using column label and the record value, to see if there is expected record with the updated data
      typeOfTypeListView.filter('Id', item.id);
      expect(typeOfTypeListView.getRecordCount()).toBeGreaterThanOrEqual(1);
    });

    it('can delete an item from item view', () => {
      // get record count before deleting a record
      typeOfTypeListView.getRecordCount().getText().then((recordCount) => {
        typeOfTypeItemView.deleteFirstItemInView();
        typeOfTypeListView.getRecordCount().getText().then((recordCountAfterDeletion) => {
          expect(parseInt(recordCountAfterDeletion)).toEqual(parseInt(recordCount) - 1);
        });
      });
    });

    it('can go back to previous view', () => {
      let urlBeforeAddingNewRecord = browser.getCurrentUrl();
      typeOfTypeListView.addButton.click();

      // click back button and check the url is the same as before
      typeOfTypeItemView.backButton.click();
      expect(browser.getCurrentUrl()).toEqual(urlBeforeAddingNewRecord);
    });

    it('can cancel an action', () => {
      // set up data to be put in new record adding action
      let item = jsonItemData.value[0];

      // get record count before adding
      typeOfTypeListView.getRecordCount().then((recordCount) => {
        typeOfTypeListView.addButton.click();

        // fill in all fields with the data
        Object.keys(item).forEach((key) => {
          typeOfTypeItemView.sendDataToControl(item, key);
        });

        typeOfTypeItemView.cancelButton.click();

        // check if record count still remains the same as before
        typeOfTypeListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount));
        });
      });
    });

    // loop and check all validations in meta data file
    it('can see validation messages', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';

      typeOfTypeListView.addButton.click();

      for (let fieldKey in metaData.properties) {
        if (metaData.properties[fieldKey]['x-ncg'].validations) {
          for (let validationType in metaData.properties[fieldKey]['x-ncg'].validations) {
            if (metaData.properties[fieldKey]['x-ncg'].validations[validationType] != null) {
              if (validationType == 'required' && metaData.properties[fieldKey]['x-ncg'].validations[validationType].value == false) {
                break;
              }
              else {
                typeOfTypeItemView.sendValidationData(fieldKey, validationType);
                validationMessageFinderString = typeOfTypeItemView.getValidationMessageFinderString(fieldKey);
                validationMessage = typeOfTypeItemView.getValidationMessage(fieldKey, validationType);
                typeOfTypeItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
                  expect(result).toBe(true);
                });
              }
            }
          }
        }
      }
    });
  
    it('can see the maxLength validation message for key field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'maxLength';
      let fieldKey = 'key';
      typeOfTypeListView.addButton.click();

      typeOfTypeItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = typeOfTypeItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = typeOfTypeItemView.getValidationMessage(fieldKey, validationType);
      
      typeOfTypeItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the minLength validation message for key field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'minLength';
      let fieldKey = 'key';
      typeOfTypeListView.addButton.click();

      typeOfTypeItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = typeOfTypeItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = typeOfTypeItemView.getValidationMessage(fieldKey, validationType);
      
      typeOfTypeItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the required validation message for key field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'required';
      let fieldKey = 'key';
      typeOfTypeListView.addButton.click();

      typeOfTypeItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = typeOfTypeItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = typeOfTypeItemView.getValidationMessage(fieldKey, validationType);
      
      typeOfTypeItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the pattern validation message for name field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'pattern';
      let fieldKey = 'name';
      typeOfTypeListView.addButton.click();

      typeOfTypeItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = typeOfTypeItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = typeOfTypeItemView.getValidationMessage(fieldKey, validationType);
      
      typeOfTypeItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
  });
});
