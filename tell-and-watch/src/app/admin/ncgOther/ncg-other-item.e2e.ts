
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { NcgOtherListView } from './ncg-other-list.view';
import { NcgOtherItemView } from './ncg-other-item.view';
import { NcgOther } from '../services/api/models/ncg-other';
import { ValidationService } from '../common/services/validation.service';
import { e2eHelper } from '../common/e2eHelper';
import * as changeCase from 'change-case';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let ncgOtherListView = new NcgOtherListView();
    let ncgOtherItemView = new NcgOtherItemView();
    let jsonItemData = require('../services/api/local/NcgOther.json');
    let metaData = require('./ncg-other.metaData.json');

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToNcgOtherView();
    });

    it('can add an item', () => {
      ncgOtherListView.getRecordCount().then((recordCount) => {
        // get the list and first item in the list
        let list = jsonItemData.value;
        let item = jsonItemData.value[0];

        // copy value of the first item to a new variable
        let newItem = JSON.parse(JSON.stringify(item));

        // assign new unique id for the new item
        newItem.id = ncgOtherItemView.generateUniqueId(list);

        // update the list
        list.push(newItem);

        ncgOtherItemView.createNewItem(newItem);

        ncgOtherListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount) + 1);
        });
      });
    });

    it('can edit an item', () => {
      // get the list and first item in the list
      let list = jsonItemData.value;
      let item = jsonItemData.value[0];

      // update id for the first item
      item.id = ncgOtherItemView.generateUniqueId(list);

      ncgOtherItemView.editItem(item);

      // filter records, using column label and the record value, to see if there is expected record with the updated data
      ncgOtherListView.filter('Id', item.id);
      expect(ncgOtherListView.getRecordCount()).toBeGreaterThanOrEqual(1);
    });

    it('can delete an item from item view', () => {
      // get record count before deleting a record
      ncgOtherListView.getRecordCount().getText().then((recordCount) => {
        ncgOtherItemView.deleteFirstItemInView();
        ncgOtherListView.getRecordCount().getText().then((recordCountAfterDeletion) => {
          expect(parseInt(recordCountAfterDeletion)).toEqual(parseInt(recordCount) - 1);
        });
      });
    });

    it('can go back to previous view', () => {
      let urlBeforeAddingNewRecord = browser.getCurrentUrl();
      ncgOtherListView.addButton.click();

      // click back button and check the url is the same as before
      ncgOtherItemView.backButton.click();
      expect(browser.getCurrentUrl()).toEqual(urlBeforeAddingNewRecord);
    });

    it('can cancel an action', () => {
      // set up data to be put in new record adding action
      let item = jsonItemData.value[0];

      // get record count before adding
      ncgOtherListView.getRecordCount().then((recordCount) => {
        ncgOtherListView.addButton.click();

        // fill in all fields with the data
        Object.keys(item).forEach((key) => {
          ncgOtherItemView.sendDataToControl(item, key);
        });

        ncgOtherItemView.cancelButton.click();

        // check if record count still remains the same as before
        ncgOtherListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount));
        });
      });
    });

    // loop and check all validations in meta data file
    it('can see validation messages', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';

      ncgOtherListView.addButton.click();

      for (let fieldKey in metaData.properties) {
        if (metaData.properties[fieldKey]['x-ncg'].validations) {
          for (let validationType in metaData.properties[fieldKey]['x-ncg'].validations) {
            if (metaData.properties[fieldKey]['x-ncg'].validations[validationType] != null) {
              if (validationType == 'required' && metaData.properties[fieldKey]['x-ncg'].validations[validationType].value == false) {
                break;
              }
              else {
                ncgOtherItemView.sendValidationData(fieldKey, validationType);
                validationMessageFinderString = ncgOtherItemView.getValidationMessageFinderString(fieldKey);
                validationMessage = ncgOtherItemView.getValidationMessage(fieldKey, validationType);
                ncgOtherItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
                  expect(result).toBe(true);
                });
              }
            }
          }
        }
      }
    });
  
  });
});
