import {
  COLLECTION_BOOKMARK_BUTTON,
  LIBRARY_SEARCH_BAR,
  LIBRARY_TAB,
  buildLibraryCardId,
} from './constants/testIds';
import FIXTURES from './fixtures/stage/structure';
import { signIn, signOut } from './utils/auth';
import { openApp } from './utils/openApp';

describe('Library', () => {
  const publishedItem = FIXTURES.items[4];

  describe('Collection View', () => {
    beforeAll(async () => {
      await openApp();
      await signIn();
      await element(by.id(LIBRARY_TAB)).tap();
    });

    afterAll(async () => {
      await signOut();
    });

    it('Layout', async () => {
      // search
      await element(by.id(LIBRARY_SEARCH_BAR)).typeText(publishedItem.name);

      await element(by.id(buildLibraryCardId(publishedItem.id!))).tap();

      // bookmark
      await element(by.id(COLLECTION_BOOKMARK_BUTTON)).tap();
      // we cannot easily check the state as the changes are always saved
    });
  });
});
