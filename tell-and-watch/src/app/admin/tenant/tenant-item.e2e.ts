
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { TenantListView } from './tenant-list.view';
import { TenantItemView } from './tenant-item.view';
import { Tenant } from '../services/api/models/tenant';
import { ValidationService } from '../common/services/validation.service';
import { e2eHelper } from '../common/e2eHelper';
import * as changeCase from 'change-case';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let tenantListView = new TenantListView();
    let tenantItemView = new TenantItemView();
    let jsonItemData = require('../services/api/local/Tenant.json');
    let metaData = require('./tenant.metaData.json');

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToTenantView();
    });

    it('can add an item', () => {
      tenantListView.getRecordCount().then((recordCount) => {
        // get the list and first item in the list
        let list = jsonItemData.value;
        let item = jsonItemData.value[0];

        // copy value of the first item to a new variable
        let newItem = JSON.parse(JSON.stringify(item));

        // assign new unique id for the new item
        newItem.id = tenantItemView.generateUniqueId(list);

        // update the list
        list.push(newItem);

        tenantItemView.createNewItem(newItem);

        tenantListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount) + 1);
        });
      });
    });

    it('can edit an item', () => {
      // get the list and first item in the list
      let list = jsonItemData.value;
      let item = jsonItemData.value[0];

      // update id for the first item
      item.id = tenantItemView.generateUniqueId(list);

      tenantItemView.editItem(item);

      // filter records, using column label and the record value, to see if there is expected record with the updated data
      tenantListView.filter('Id', item.id);
      expect(tenantListView.getRecordCount()).toBeGreaterThanOrEqual(1);
    });

    it('can delete an item from item view', () => {
      // get record count before deleting a record
      tenantListView.getRecordCount().getText().then((recordCount) => {
        tenantItemView.deleteFirstItemInView();
        tenantListView.getRecordCount().getText().then((recordCountAfterDeletion) => {
          expect(parseInt(recordCountAfterDeletion)).toEqual(parseInt(recordCount) - 1);
        });
      });
    });

    it('can go back to previous view', () => {
      let urlBeforeAddingNewRecord = browser.getCurrentUrl();
      tenantListView.addButton.click();

      // click back button and check the url is the same as before
      tenantItemView.backButton.click();
      expect(browser.getCurrentUrl()).toEqual(urlBeforeAddingNewRecord);
    });

    it('can cancel an action', () => {
      // set up data to be put in new record adding action
      let item = jsonItemData.value[0];

      // get record count before adding
      tenantListView.getRecordCount().then((recordCount) => {
        tenantListView.addButton.click();

        // fill in all fields with the data
        Object.keys(item).forEach((key) => {
          tenantItemView.sendDataToControl(item, key);
        });

        tenantItemView.cancelButton.click();

        // check if record count still remains the same as before
        tenantListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount));
        });
      });
    });

    // loop and check all validations in meta data file
    it('can see validation messages', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';

      tenantListView.addButton.click();

      for (let fieldKey in metaData.properties) {
        if (metaData.properties[fieldKey]['x-ncg'].validations) {
          for (let validationType in metaData.properties[fieldKey]['x-ncg'].validations) {
            if (metaData.properties[fieldKey]['x-ncg'].validations[validationType] != null) {
              if (validationType == 'required' && metaData.properties[fieldKey]['x-ncg'].validations[validationType].value == false) {
                break;
              }
              else {
                tenantItemView.sendValidationData(fieldKey, validationType);
                validationMessageFinderString = tenantItemView.getValidationMessageFinderString(fieldKey);
                validationMessage = tenantItemView.getValidationMessage(fieldKey, validationType);
                tenantItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
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
      tenantListView.addButton.click();

      tenantItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = tenantItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = tenantItemView.getValidationMessage(fieldKey, validationType);
      
      tenantItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the required validation message for concurrencyStamp field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'required';
      let fieldKey = 'concurrencyStamp';
      tenantListView.addButton.click();

      tenantItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = tenantItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = tenantItemView.getValidationMessage(fieldKey, validationType);
      
      tenantItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the required validation message for created field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'required';
      let fieldKey = 'created';
      tenantListView.addButton.click();

      tenantItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = tenantItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = tenantItemView.getValidationMessage(fieldKey, validationType);
      
      tenantItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the required validation message for issuerValue field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'required';
      let fieldKey = 'issuerValue';
      tenantListView.addButton.click();

      tenantItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = tenantItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = tenantItemView.getValidationMessage(fieldKey, validationType);
      
      tenantItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the maxLength validation message for issuerValue field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'maxLength';
      let fieldKey = 'issuerValue';
      tenantListView.addButton.click();

      tenantItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = tenantItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = tenantItemView.getValidationMessage(fieldKey, validationType);
      
      tenantItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the minLength validation message for issuerValue field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'minLength';
      let fieldKey = 'issuerValue';
      tenantListView.addButton.click();

      tenantItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = tenantItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = tenantItemView.getValidationMessage(fieldKey, validationType);
      
      tenantItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the required validation message for name field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'required';
      let fieldKey = 'name';
      tenantListView.addButton.click();

      tenantItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = tenantItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = tenantItemView.getValidationMessage(fieldKey, validationType);
      
      tenantItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
  });
});
