
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { TypeOfTypeListView } from './type-of-type-list.view';
import { e2eHelper } from '../common/e2eHelper';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let typeOfTypeListView = new TypeOfTypeListView();

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToTypeOfTypeView();
    });

    it('can control paging', () => {
      let defaultNumberOfRecordsPerPage = 5;

      typeOfTypeListView.getRecordCount().then((recordCount) => {
        // Set paging number equal to total records so as to contain all records on 1 page
        typeOfTypeListView.setNumberOfRecordsPerPage(recordCount);
        typeOfTypeListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(1);
        });

        // Use default paging number and check if total pages are generated correctly 
        typeOfTypeListView.setNumberOfRecordsPerPage(defaultNumberOfRecordsPerPage);
        typeOfTypeListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(typeOfTypeListView.calculatePagingNumber(recordCount, defaultNumberOfRecordsPerPage));
        });
      });
    })

    it('can sort records', () => {
      let columnLabel = "Id";
      typeOfTypeListView.getcolumnIndex(columnLabel).then((columnIndex) => {
        let arrBeforeSorting = [];
        let arrAfterSorting = [];

        typeOfTypeListView.sortColumn(columnIndex);

        // Get values of first and last records of a field before doing sorting records again
        typeOfTypeListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrBeforeSorting = arr;
        });

        // Sort records again
        typeOfTypeListView.sortColumn(columnIndex);

        // Get values of first and last records of that same field again
        typeOfTypeListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrAfterSorting = arr;

          // Swap 2 items in the array (reverse the order of the array items)
          typeOfTypeListView.swapArrayItems(arrBeforeSorting, 0, 1);
          expect(arrBeforeSorting).toEqual(arrAfterSorting);
        });
      });
    });
  });
});
