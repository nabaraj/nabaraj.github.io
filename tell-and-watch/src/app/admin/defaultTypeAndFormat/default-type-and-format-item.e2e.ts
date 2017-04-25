
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { DefaultTypeAndFormatListView } from './default-type-and-format-list.view';
import { DefaultTypeAndFormatItemView } from './default-type-and-format-item.view';
import { DefaultTypeAndFormat } from '../services/api/models/default-type-and-format';
import { ValidationService } from '../common/services/validation.service';
import { e2eHelper } from '../common/e2eHelper';
import * as changeCase from 'change-case';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let defaultTypeAndFormatListView = new DefaultTypeAndFormatListView();
    let defaultTypeAndFormatItemView = new DefaultTypeAndFormatItemView();
    let jsonItemData = require('../services/api/local/DefaultTypeAndFormat.json');
    let metaData = require('./default-type-and-format.metaData.json');

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToDefaultTypeAndFormatView();
    });

    it('can add an item', () => {
      defaultTypeAndFormatListView.getRecordCount().then((recordCount) => {
        // get the list and first item in the list
        let list = jsonItemData.value;
        let item = jsonItemData.value[0];

        // copy value of the first item to a new variable
        let newItem = JSON.parse(JSON.stringify(item));

        // assign new unique id for the new item
        newItem.id = defaultTypeAndFormatItemView.generateUniqueId(list);

        // update the list
        list.push(newItem);

        defaultTypeAndFormatItemView.createNewItem(newItem);

        defaultTypeAndFormatListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount) + 1);
        });
      });
    });

    it('can edit an item', () => {
      // get the list and first item in the list
      let list = jsonItemData.value;
      let item = jsonItemData.value[0];

      // update id for the first item
      item.id = defaultTypeAndFormatItemView.generateUniqueId(list);

      defaultTypeAndFormatItemView.editItem(item);

      // filter records, using column label and the record value, to see if there is expected record with the updated data
      defaultTypeAndFormatListView.filter('Id', item.id);
      expect(defaultTypeAndFormatListView.getRecordCount()).toBeGreaterThanOrEqual(1);
    });

    it('can delete an item from item view', () => {
      // get record count before deleting a record
      defaultTypeAndFormatListView.getRecordCount().getText().then((recordCount) => {
        defaultTypeAndFormatItemView.deleteFirstItemInView();
        defaultTypeAndFormatListView.getRecordCount().getText().then((recordCountAfterDeletion) => {
          expect(parseInt(recordCountAfterDeletion)).toEqual(parseInt(recordCount) - 1);
        });
      });
    });

    it('can go back to previous view', () => {
      let urlBeforeAddingNewRecord = browser.getCurrentUrl();
      defaultTypeAndFormatListView.addButton.click();

      // click back button and check the url is the same as before
      defaultTypeAndFormatItemView.backButton.click();
      expect(browser.getCurrentUrl()).toEqual(urlBeforeAddingNewRecord);
    });

    it('can cancel an action', () => {
      // set up data to be put in new record adding action
      let item = jsonItemData.value[0];

      // get record count before adding
      defaultTypeAndFormatListView.getRecordCount().then((recordCount) => {
        defaultTypeAndFormatListView.addButton.click();

        // fill in all fields with the data
        Object.keys(item).forEach((key) => {
          defaultTypeAndFormatItemView.sendDataToControl(item, key);
        });

        defaultTypeAndFormatItemView.cancelButton.click();

        // check if record count still remains the same as before
        defaultTypeAndFormatListView.getRecordCount().then((updatedRecordCount) => {
          expect(parseInt(updatedRecordCount)).toEqual(parseInt(recordCount));
        });
      });
    });

    // loop and check all validations in meta data file
    it('can see validation messages', () => {
      let validationMessage = '';
      let validationMessageFinderString = '';

      defaultTypeAndFormatListView.addButton.click();

      for (let fieldKey in metaData.properties) {
        if (metaData.properties[fieldKey]['x-ncg'].validations) {
          for (let validationType in metaData.properties[fieldKey]['x-ncg'].validations) {
            if (metaData.properties[fieldKey]['x-ncg'].validations[validationType] != null) {
              if (validationType == 'required' && metaData.properties[fieldKey]['x-ncg'].validations[validationType].value == false) {
                break;
              }
              else {
                defaultTypeAndFormatItemView.sendValidationData(fieldKey, validationType);
                validationMessageFinderString = defaultTypeAndFormatItemView.getValidationMessageFinderString(fieldKey);
                validationMessage = defaultTypeAndFormatItemView.getValidationMessage(fieldKey, validationType);
                defaultTypeAndFormatItemView.checkValidation(validationMessage, validationMessageFinderString).then((result) => {
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
