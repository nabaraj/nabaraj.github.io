
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { ValidationListView } from './validation-list.view';
import { ValidationItemView } from './validation-item.view';
import { Validation } from '../services/api/models/validation';
import { ValidationService } from '../common/services/validation.service';
import { e2eHelper } from '../common/e2eHelper';
import * as changeCase from 'change-case';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let validationListView = new ValidationListView();
    let validationItemView = new ValidationItemView();
    let jsonItemData = require('../services/api/local/Validation.json');
    let metaData = require('./validation.metaData.json');

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToValidationView();
    });

    it('can add an item', () => {
      validationListView.getRecordCount().then((recordCount) => {
        // get the list and first item in the list
        let list = jsonItemData.value;
        let item = jsonItemData.value[0];

        // copy value of the first item to a new variable
        let newItem = JSON.parse(JSON.stringify(item));

        // assign new unique id for the new item
        newItem.id = validationItemView.generateUniqueId(list);

        // update the list
        list.push(newItem);

        validationItemView.createNewItem(newItem);

        validationListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount) + 1);
        });
      });
    });

    it('can edit an item', () => {
      // get the list and first item in the list
      let list = jsonItemData.value;
      let item = jsonItemData.value[0];

      // update id for the first item
      item.id = validationItemView.generateUniqueId(list);

      validationItemView.editItem(item);

      // filter records, using column label and the record value, to see if there is expected record with the updated data
      validationListView.filter('Id', item.id);
      expect(validationListView.getRecordCount()).toBeGreaterThanOrEqual(1);
    });

    it('can delete an item from item view', () => {
      // get record count before deleting a record
      validationListView.getRecordCount().getText().then((recordCount) => {
        validationItemView.deleteFirstItemInView();
        validationListView.getRecordCount().getText().then((recordCountAfterDeletion) => {
          expect(parseInt(recordCountAfterDeletion)).toEqual(parseInt(recordCount) - 1);
        });
      });
    });

    it('can go back to previous view', () => {
      let urlBeforeAddingNewRecord = browser.getCurrentUrl();
      validationListView.addButton.click();

      // click back button and check the url is the same as before
      validationItemView.backButton.click();
      expect(browser.getCurrentUrl()).toEqual(urlBeforeAddingNewRecord);
    });

    it('can cancel an action', () => {
      // set up data to be put in new record adding action
      let item = jsonItemData.value[0];

      // get record count before adding
      validationListView.getRecordCount().then((recordCount) => {
        validationListView.addButton.click();

        // fill in all fields with the data
        Object.keys(item).forEach((key) => {
          validationItemView.sendDataToControl(item, key);
        });

        validationItemView.cancelButton.click();

        // check if record count still remains the same as before
        validationListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount));
        });
      });
    });

    // loop and check all validations in meta data file
    it('can see validation messages', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';

      validationListView.addButton.click();

      for (let fieldKey in metaData.properties) {
        if (metaData.properties[fieldKey]['x-ncg'].validations) {
          for (let validationType in metaData.properties[fieldKey]['x-ncg'].validations) {
            if (metaData.properties[fieldKey]['x-ncg'].validations[validationType] != null) {
              if (validationType == 'required' && metaData.properties[fieldKey]['x-ncg'].validations[validationType].value == false) {
                break;
              }
              else {
                validationItemView.sendValidationData(fieldKey, validationType);
                validationMessageFinderString = validationItemView.getValidationMessageFinderString(fieldKey);
                validationMessage = validationItemView.getValidationMessage(fieldKey, validationType);
                validationItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
                  expect(result).toBe(true);
                });
              }
            }
          }
        }
      }
    });
  
    it('can see the maxLength validation message for phone field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'maxLength';
      let fieldKey = 'phone';
      validationListView.addButton.click();

      validationItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = validationItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = validationItemView.getValidationMessage(fieldKey, validationType);
      
      validationItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the minLength validation message for phone field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'minLength';
      let fieldKey = 'phone';
      validationListView.addButton.click();

      validationItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = validationItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = validationItemView.getValidationMessage(fieldKey, validationType);
      
      validationItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the maxLength validation message for string field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'maxLength';
      let fieldKey = 'string';
      validationListView.addButton.click();

      validationItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = validationItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = validationItemView.getValidationMessage(fieldKey, validationType);
      
      validationItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the minLength validation message for string field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'minLength';
      let fieldKey = 'string';
      validationListView.addButton.click();

      validationItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = validationItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = validationItemView.getValidationMessage(fieldKey, validationType);
      
      validationItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
  });
});
