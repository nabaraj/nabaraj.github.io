
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { NcgValidationListView } from './ncg-validation-list.view';
import { NcgValidationItemView } from './ncg-validation-item.view';
import { NcgValidation } from '../services/api/models/ncg-validation';
import { ValidationService } from '../common/services/validation.service';
import { e2eHelper } from '../common/e2eHelper';
import * as changeCase from 'change-case';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let ncgValidationListView = new NcgValidationListView();
    let ncgValidationItemView = new NcgValidationItemView();
    let jsonItemData = require('../services/api/local/NcgValidation.json');
    let metaData = require('./ncg-validation.metaData.json');

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToNcgValidationView();
    });

    it('can add an item', () => {
      ncgValidationListView.getRecordCount().then((recordCount) => {
        // get the list and first item in the list
        let list = jsonItemData.value;
        let item = jsonItemData.value[0];

        // copy value of the first item to a new variable
        let newItem = JSON.parse(JSON.stringify(item));

        // assign new unique id for the new item
        newItem.id = ncgValidationItemView.generateUniqueId(list);

        // update the list
        list.push(newItem);

        ncgValidationItemView.createNewItem(newItem);

        ncgValidationListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount) + 1);
        });
      });
    });

    it('can edit an item', () => {
      // get the list and first item in the list
      let list = jsonItemData.value;
      let item = jsonItemData.value[0];

      // update id for the first item
      item.id = ncgValidationItemView.generateUniqueId(list);

      ncgValidationItemView.editItem(item);

      // filter records, using column label and the record value, to see if there is expected record with the updated data
      ncgValidationListView.filter('Id', item.id);
      expect(ncgValidationListView.getRecordCount()).toBeGreaterThanOrEqual(1);
    });

    it('can delete an item from item view', () => {
      // get record count before deleting a record
      ncgValidationListView.getRecordCount().getText().then((recordCount) => {
        ncgValidationItemView.deleteFirstItemInView();
        ncgValidationListView.getRecordCount().getText().then((recordCountAfterDeletion) => {
          expect(parseInt(recordCountAfterDeletion)).toEqual(parseInt(recordCount) - 1);
        });
      });
    });

    it('can go back to previous view', () => {
      let urlBeforeAddingNewRecord = browser.getCurrentUrl();
      ncgValidationListView.addButton.click();

      // click back button and check the url is the same as before
      ncgValidationItemView.backButton.click();
      expect(browser.getCurrentUrl()).toEqual(urlBeforeAddingNewRecord);
    });

    it('can cancel an action', () => {
      // set up data to be put in new record adding action
      let item = jsonItemData.value[0];

      // get record count before adding
      ncgValidationListView.getRecordCount().then((recordCount) => {
        ncgValidationListView.addButton.click();

        // fill in all fields with the data
        Object.keys(item).forEach((key) => {
          ncgValidationItemView.sendDataToControl(item, key);
        });

        ncgValidationItemView.cancelButton.click();

        // check if record count still remains the same as before
        ncgValidationListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount));
        });
      });
    });

    // loop and check all validations in meta data file
    it('can see validation messages', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';

      ncgValidationListView.addButton.click();

      for (let fieldKey in metaData.properties) {
        if (metaData.properties[fieldKey]['x-ncg'].validations) {
          for (let validationType in metaData.properties[fieldKey]['x-ncg'].validations) {
            if (metaData.properties[fieldKey]['x-ncg'].validations[validationType] != null) {
              if (validationType == 'required' && metaData.properties[fieldKey]['x-ncg'].validations[validationType].value == false) {
                break;
              }
              else {
                ncgValidationItemView.sendValidationData(fieldKey, validationType);
                validationMessageFinderString = ncgValidationItemView.getValidationMessageFinderString(fieldKey);
                validationMessage = ncgValidationItemView.getValidationMessage(fieldKey, validationType);
                ncgValidationItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
                  expect(result).toBe(true);
                });
              }
            }
          }
        }
      }
    });
  
    it('can see the pattern validation message for valEmailAddressPattern field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'pattern';
      let fieldKey = 'valEmailAddressPattern';
      ncgValidationListView.addButton.click();

      ncgValidationItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = ncgValidationItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = ncgValidationItemView.getValidationMessage(fieldKey, validationType);
      
      ncgValidationItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the maximum validation message for valMin0Max100Value field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'maximum';
      let fieldKey = 'valMin0Max100Value';
      ncgValidationListView.addButton.click();

      ncgValidationItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = ncgValidationItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = ncgValidationItemView.getValidationMessage(fieldKey, validationType);
      
      ncgValidationItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the minimum validation message for valMin0Max100Value field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'minimum';
      let fieldKey = 'valMin0Max100Value';
      ncgValidationListView.addButton.click();

      ncgValidationItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = ncgValidationItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = ncgValidationItemView.getValidationMessage(fieldKey, validationType);
      
      ncgValidationItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the maxLength validation message for valMin2Max8Length field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'maxLength';
      let fieldKey = 'valMin2Max8Length';
      ncgValidationListView.addButton.click();

      ncgValidationItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = ncgValidationItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = ncgValidationItemView.getValidationMessage(fieldKey, validationType);
      
      ncgValidationItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the minLength validation message for valMin2Max8Length field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'minLength';
      let fieldKey = 'valMin2Max8Length';
      ncgValidationListView.addButton.click();

      ncgValidationItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = ncgValidationItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = ncgValidationItemView.getValidationMessage(fieldKey, validationType);
      
      ncgValidationItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the required validation message for valRequiredField field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'required';
      let fieldKey = 'valRequiredField';
      ncgValidationListView.addButton.click();

      ncgValidationItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = ncgValidationItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = ncgValidationItemView.getValidationMessage(fieldKey, validationType);
      
      ncgValidationItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
  });
});
