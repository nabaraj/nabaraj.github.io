
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { NcgTypeAndFormatListView } from './ncg-type-and-format-list.view';
import { NcgTypeAndFormatItemView } from './ncg-type-and-format-item.view';
import { NcgTypeAndFormat } from '../services/api/models/ncg-type-and-format';
import { ValidationService } from '../common/services/validation.service';
import { e2eHelper } from '../common/e2eHelper';
import * as changeCase from 'change-case';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let ncgTypeAndFormatListView = new NcgTypeAndFormatListView();
    let ncgTypeAndFormatItemView = new NcgTypeAndFormatItemView();
    let jsonItemData = require('../services/api/local/NcgTypeAndFormat.json');
    let metaData = require('./ncg-type-and-format.metaData.json');

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToNcgTypeAndFormatView();
    });

    it('can add an item', () => {
      ncgTypeAndFormatListView.getRecordCount().then((recordCount) => {
        // get the list and first item in the list
        let list = jsonItemData.value;
        let item = jsonItemData.value[0];

        // copy value of the first item to a new variable
        let newItem = JSON.parse(JSON.stringify(item));

        // assign new unique id for the new item
        newItem.id = ncgTypeAndFormatItemView.generateUniqueId(list);

        // update the list
        list.push(newItem);

        ncgTypeAndFormatItemView.createNewItem(newItem);

        ncgTypeAndFormatListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount) + 1);
        });
      });
    });

    it('can edit an item', () => {
      // get the list and first item in the list
      let list = jsonItemData.value;
      let item = jsonItemData.value[0];

      // update id for the first item
      item.id = ncgTypeAndFormatItemView.generateUniqueId(list);

      ncgTypeAndFormatItemView.editItem(item);

      // filter records, using column label and the record value, to see if there is expected record with the updated data
      ncgTypeAndFormatListView.filter('Id', item.id);
      expect(ncgTypeAndFormatListView.getRecordCount()).toBeGreaterThanOrEqual(1);
    });

    it('can delete an item from item view', () => {
      // get record count before deleting a record
      ncgTypeAndFormatListView.getRecordCount().getText().then((recordCount) => {
        ncgTypeAndFormatItemView.deleteFirstItemInView();
        ncgTypeAndFormatListView.getRecordCount().getText().then((recordCountAfterDeletion) => {
          expect(parseInt(recordCountAfterDeletion)).toEqual(parseInt(recordCount) - 1);
        });
      });
    });

    it('can go back to previous view', () => {
      let urlBeforeAddingNewRecord = browser.getCurrentUrl();
      ncgTypeAndFormatListView.addButton.click();

      // click back button and check the url is the same as before
      ncgTypeAndFormatItemView.backButton.click();
      expect(browser.getCurrentUrl()).toEqual(urlBeforeAddingNewRecord);
    });

    it('can cancel an action', () => {
      // set up data to be put in new record adding action
      let item = jsonItemData.value[0];

      // get record count before adding
      ncgTypeAndFormatListView.getRecordCount().then((recordCount) => {
        ncgTypeAndFormatListView.addButton.click();

        // fill in all fields with the data
        Object.keys(item).forEach((key) => {
          ncgTypeAndFormatItemView.sendDataToControl(item, key);
        });

        ncgTypeAndFormatItemView.cancelButton.click();

        // check if record count still remains the same as before
        ncgTypeAndFormatListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount));
        });
      });
    });

    // loop and check all validations in meta data file
    it('can see validation messages', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';

      ncgTypeAndFormatListView.addButton.click();

      for (let fieldKey in metaData.properties) {
        if (metaData.properties[fieldKey]['x-ncg'].validations) {
          for (let validationType in metaData.properties[fieldKey]['x-ncg'].validations) {
            if (metaData.properties[fieldKey]['x-ncg'].validations[validationType] != null) {
              if (validationType == 'required' && metaData.properties[fieldKey]['x-ncg'].validations[validationType].value == false) {
                break;
              }
              else {
                ncgTypeAndFormatItemView.sendValidationData(fieldKey, validationType);
                validationMessageFinderString = ncgTypeAndFormatItemView.getValidationMessageFinderString(fieldKey);
                validationMessage = ncgTypeAndFormatItemView.getValidationMessage(fieldKey, validationType);
                ncgTypeAndFormatItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
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
