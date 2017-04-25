
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { SomeItemListView } from './some-item-list.view';
import { SomeItemItemView } from './some-item-item.view';
import { SomeItem } from '../services/api/models/some-item';
import { ValidationService } from '../common/services/validation.service';
import { e2eHelper } from '../common/e2eHelper';
import * as changeCase from 'change-case';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let someItemListView = new SomeItemListView();
    let someItemItemView = new SomeItemItemView();
    let jsonItemData = require('../services/api/local/SomeItem.json');
    let metaData = require('./some-item.metaData.json');

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToSomeItemView();
    });

    it('can add an item', () => {
      someItemListView.getRecordCount().then((recordCount) => {
        // get the list and first item in the list
        let list = jsonItemData.value;
        let item = jsonItemData.value[0];

        // copy value of the first item to a new variable
        let newItem = JSON.parse(JSON.stringify(item));

        // assign new unique id for the new item
        newItem.id = someItemItemView.generateUniqueId(list);

        // update the list
        list.push(newItem);

        someItemItemView.createNewItem(newItem);

        someItemListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount) + 1);
        });
      });
    });

    it('can edit an item', () => {
      // get the list and first item in the list
      let list = jsonItemData.value;
      let item = jsonItemData.value[0];

      // update id for the first item
      item.id = someItemItemView.generateUniqueId(list);

      someItemItemView.editItem(item);

      // filter records, using column label and the record value, to see if there is expected record with the updated data
      someItemListView.filter('Id', item.id);
      expect(someItemListView.getRecordCount()).toBeGreaterThanOrEqual(1);
    });

    it('can delete an item from item view', () => {
      // get record count before deleting a record
      someItemListView.getRecordCount().getText().then((recordCount) => {
        someItemItemView.deleteFirstItemInView();
        someItemListView.getRecordCount().getText().then((recordCountAfterDeletion) => {
          expect(parseInt(recordCountAfterDeletion)).toEqual(parseInt(recordCount) - 1);
        });
      });
    });

    it('can go back to previous view', () => {
      let urlBeforeAddingNewRecord = browser.getCurrentUrl();
      someItemListView.addButton.click();

      // click back button and check the url is the same as before
      someItemItemView.backButton.click();
      expect(browser.getCurrentUrl()).toEqual(urlBeforeAddingNewRecord);
    });

    it('can cancel an action', () => {
      // set up data to be put in new record adding action
      let item = jsonItemData.value[0];

      // get record count before adding
      someItemListView.getRecordCount().then((recordCount) => {
        someItemListView.addButton.click();

        // fill in all fields with the data
        Object.keys(item).forEach((key) => {
          someItemItemView.sendDataToControl(item, key);
        });

        someItemItemView.cancelButton.click();

        // check if record count still remains the same as before
        someItemListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount));
        });
      });
    });

    // loop and check all validations in meta data file
    it('can see validation messages', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';

      someItemListView.addButton.click();

      for (let fieldKey in metaData.properties) {
        if (metaData.properties[fieldKey]['x-ncg'].validations) {
          for (let validationType in metaData.properties[fieldKey]['x-ncg'].validations) {
            if (metaData.properties[fieldKey]['x-ncg'].validations[validationType] != null) {
              if (validationType == 'required' && metaData.properties[fieldKey]['x-ncg'].validations[validationType].value == false) {
                break;
              }
              else {
                someItemItemView.sendValidationData(fieldKey, validationType);
                validationMessageFinderString = someItemItemView.getValidationMessageFinderString(fieldKey);
                validationMessage = someItemItemView.getValidationMessage(fieldKey, validationType);
                someItemItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
                  expect(result).toBe(true);
                });
              }
            }
          }
        }
      }
    });
  
    it('can see the required validation message for id field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'required';
      let fieldKey = 'id';
      someItemListView.addButton.click();

      someItemItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = someItemItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = someItemItemView.getValidationMessage(fieldKey, validationType);
      
      someItemItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the required validation message for name field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'required';
      let fieldKey = 'name';
      someItemListView.addButton.click();

      someItemItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = someItemItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = someItemItemView.getValidationMessage(fieldKey, validationType);
      
      someItemItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
  });
});
