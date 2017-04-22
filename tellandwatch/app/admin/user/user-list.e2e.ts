
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { UserListView } from './user-list.view';
import { e2eHelper } from '../common/e2eHelper';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let userListView = new UserListView();

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToUserView();
    });

    it('can control paging', () => {
      let defaultNumberOfRecordsPerPage = 5;

      userListView.getRecordCount().then((recordCount) => {
        // Set paging number equal to total records so as to contain all records on 1 page
        userListView.setNumberOfRecordsPerPage(recordCount);
        userListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(1);
        });

        // Use default paging number and check if total pages are generated correctly 
        userListView.setNumberOfRecordsPerPage(defaultNumberOfRecordsPerPage);
        userListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(userListView.calculatePagingNumber(recordCount, defaultNumberOfRecordsPerPage));
        });
      });
    })

    it('can sort records', () => {
      let columnLabel = "Id";
      userListView.getcolumnIndex(columnLabel).then((columnIndex) => {
        let arrBeforeSorting = [];
        let arrAfterSorting = [];

        userListView.sortColumn(columnIndex);

        // Get values of first and last records of a field before doing sorting records again
        userListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrBeforeSorting = arr;
        });

        // Sort records again
        userListView.sortColumn(columnIndex);

        // Get values of first and last records of that same field again
        userListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrAfterSorting = arr;

          // Swap 2 items in the array (reverse the order of the array items)
          userListView.swapArrayItems(arrBeforeSorting, 0, 1);
          expect(arrBeforeSorting).toEqual(arrAfterSorting);
        });
      });
    });
  });
});
