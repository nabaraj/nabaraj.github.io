
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { UserListView } from './user-list.view';
import { UserItemView } from './user-item.view';
import { User } from '../services/api/models/user';
import { ValidationService } from '../common/services/validation.service';
import { e2eHelper } from '../common/e2eHelper';
import * as changeCase from 'change-case';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let userListView = new UserListView();
    let userItemView = new UserItemView();
    let jsonItemData = require('../services/api/local/User.json');
    let metaData = require('./user.metaData.json');

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToUserView();
    });

    it('can add an item', () => {
      userListView.getRecordCount().then((recordCount) => {
        // get the list and first item in the list
        let list = jsonItemData.value;
        let item = jsonItemData.value[0];

        // copy value of the first item to a new variable
        let newItem = JSON.parse(JSON.stringify(item));

        // assign new unique id for the new item
        newItem.id = userItemView.generateUniqueId(list);

        // update the list
        list.push(newItem);

        userItemView.createNewItem(newItem);

        userListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount) + 1);
        });
      });
    });

    it('can edit an item', () => {
      // get the list and first item in the list
      let list = jsonItemData.value;
      let item = jsonItemData.value[0];

      // update id for the first item
      item.id = userItemView.generateUniqueId(list);

      userItemView.editItem(item);

      // filter records, using column label and the record value, to see if there is expected record with the updated data
      userListView.filter('Id', item.id);
      expect(userListView.getRecordCount()).toBeGreaterThanOrEqual(1);
    });

    it('can delete an item from item view', () => {
      // get record count before deleting a record
      userListView.getRecordCount().getText().then((recordCount) => {
        userItemView.deleteFirstItemInView();
        userListView.getRecordCount().getText().then((recordCountAfterDeletion) => {
          expect(parseInt(recordCountAfterDeletion)).toEqual(parseInt(recordCount) - 1);
        });
      });
    });

    it('can go back to previous view', () => {
      let urlBeforeAddingNewRecord = browser.getCurrentUrl();
      userListView.addButton.click();

      // click back button and check the url is the same as before
      userItemView.backButton.click();
      expect(browser.getCurrentUrl()).toEqual(urlBeforeAddingNewRecord);
    });

    it('can cancel an action', () => {
      // set up data to be put in new record adding action
      let item = jsonItemData.value[0];

      // get record count before adding
      userListView.getRecordCount().then((recordCount) => {
        userListView.addButton.click();

        // fill in all fields with the data
        Object.keys(item).forEach((key) => {
          userItemView.sendDataToControl(item, key);
        });

        userItemView.cancelButton.click();

        // check if record count still remains the same as before
        userListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount));
        });
      });
    });

    // loop and check all validations in meta data file
    it('can see validation messages', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';

      userListView.addButton.click();

      for (let fieldKey in metaData.properties) {
        if (metaData.properties[fieldKey]['x-ncg'].validations) {
          for (let validationType in metaData.properties[fieldKey]['x-ncg'].validations) {
            if (metaData.properties[fieldKey]['x-ncg'].validations[validationType] != null) {
              if (validationType == 'required' && metaData.properties[fieldKey]['x-ncg'].validations[validationType].value == false) {
                break;
              }
              else {
                userItemView.sendValidationData(fieldKey, validationType);
                validationMessageFinderString = userItemView.getValidationMessageFinderString(fieldKey);
                validationMessage = userItemView.getValidationMessage(fieldKey, validationType);
                userItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
                  expect(result).toBe(true);
                });
              }
            }
          }
        }
      }
    });
  
    it('can see the maxLength validation message for address field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'maxLength';
      let fieldKey = 'address';
      userListView.addButton.click();

      userItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = userItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = userItemView.getValidationMessage(fieldKey, validationType);
      
      userItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the minLength validation message for address field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'minLength';
      let fieldKey = 'address';
      userListView.addButton.click();

      userItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = userItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = userItemView.getValidationMessage(fieldKey, validationType);
      
      userItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the required validation message for address field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'required';
      let fieldKey = 'address';
      userListView.addButton.click();

      userItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = userItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = userItemView.getValidationMessage(fieldKey, validationType);
      
      userItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the required validation message for age field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'required';
      let fieldKey = 'age';
      userListView.addButton.click();

      userItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = userItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = userItemView.getValidationMessage(fieldKey, validationType);
      
      userItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the maximum validation message for age field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'maximum';
      let fieldKey = 'age';
      userListView.addButton.click();

      userItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = userItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = userItemView.getValidationMessage(fieldKey, validationType);
      
      userItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the minimum validation message for age field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'minimum';
      let fieldKey = 'age';
      userListView.addButton.click();

      userItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = userItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = userItemView.getValidationMessage(fieldKey, validationType);
      
      userItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the pattern validation message for emailAddress field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'pattern';
      let fieldKey = 'emailAddress';
      userListView.addButton.click();

      userItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = userItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = userItemView.getValidationMessage(fieldKey, validationType);
      
      userItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the required validation message for emailAddress field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'required';
      let fieldKey = 'emailAddress';
      userListView.addButton.click();

      userItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = userItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = userItemView.getValidationMessage(fieldKey, validationType);
      
      userItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the required validation message for gender field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'required';
      let fieldKey = 'gender';
      userListView.addButton.click();

      userItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = userItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = userItemView.getValidationMessage(fieldKey, validationType);
      
      userItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the maxLength validation message for name field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'maxLength';
      let fieldKey = 'name';
      userListView.addButton.click();

      userItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = userItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = userItemView.getValidationMessage(fieldKey, validationType);
      
      userItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the required validation message for name field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'required';
      let fieldKey = 'name';
      userListView.addButton.click();

      userItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = userItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = userItemView.getValidationMessage(fieldKey, validationType);
      
      userItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the required validation message for phone field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'required';
      let fieldKey = 'phone';
      userListView.addButton.click();

      userItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = userItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = userItemView.getValidationMessage(fieldKey, validationType);
      
      userItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
    it('can see the required validation message for reOrderLevel field', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';
      let validationType = 'required';
      let fieldKey = 'reOrderLevel';
      userListView.addButton.click();

      userItemView.sendValidationData(fieldKey, validationType);
      validationMessageFinderString = userItemView.getValidationMessageFinderString(fieldKey);
      validationMessage = userItemView.getValidationMessage(fieldKey, validationType);
      
      userItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
        expect(result).toBe(true);
      });
    });
    
  });
});
