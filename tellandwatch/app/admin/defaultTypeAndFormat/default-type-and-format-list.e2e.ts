
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { DefaultTypeAndFormatListView } from './default-type-and-format-list.view';
import { e2eHelper } from '../common/e2eHelper';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let defaultTypeAndFormatListView = new DefaultTypeAndFormatListView();

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToDefaultTypeAndFormatView();
    });

    it('can control paging', () => {
      let defaultNumberOfRecordsPerPage = 5;

      defaultTypeAndFormatListView.getRecordCount().then((recordCount) => {
        // Set paging number equal to total records so as to contain all records on 1 page
        defaultTypeAndFormatListView.setNumberOfRecordsPerPage(recordCount);
        defaultTypeAndFormatListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(1);
        });

        // Use default paging number and check if total pages are generated correctly 
        defaultTypeAndFormatListView.setNumberOfRecordsPerPage(defaultNumberOfRecordsPerPage);
        defaultTypeAndFormatListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(defaultTypeAndFormatListView.calculatePagingNumber(recordCount, defaultNumberOfRecordsPerPage));
        });
      });
    })

    it('can sort records', () => {
      let columnLabel = "Id";
      defaultTypeAndFormatListView.getcolumnIndex(columnLabel).then((columnIndex) => {
        let arrBeforeSorting = [];
        let arrAfterSorting = [];

        defaultTypeAndFormatListView.sortColumn(columnIndex);

        // Get values of first and last records of a field before doing sorting records again
        defaultTypeAndFormatListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrBeforeSorting = arr;
        });

        // Sort records again
        defaultTypeAndFormatListView.sortColumn(columnIndex);

        // Get values of first and last records of that same field again
        defaultTypeAndFormatListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrAfterSorting = arr;

          // Swap 2 items in the array (reverse the order of the array items)
          defaultTypeAndFormatListView.swapArrayItems(arrBeforeSorting, 0, 1);
          expect(arrBeforeSorting).toEqual(arrAfterSorting);
        });
      });
    });
  });
});
