import { expect } from 'detox';

import {
  ITEM_LIST_OPTIONS,
  ITEM_LIST_OPTIONS_MAP,
  MAP_SCREEN,
  MY_ITEMS_MAP_BUTTON,
  MY_ITEMS_TAB,
} from './constants/testIds';
import { signIn } from './utils/auth';
import { openApp } from './utils/openApp';

describe('Map', () => {
  describe('Map View', () => {
    beforeEach(async () => {
      await openApp();
      await signIn();
      await element(by.id(MY_ITEMS_TAB)).tap();
    });

    // enable back when the back button can be clicked
    // afterAll(async () => {
    //   await signOut();
    // });

    it('Show map screen from elements tab', async () => {
      // search
      await element(by.id(MY_ITEMS_MAP_BUTTON)).tap();

      await expect(element(by.id(MAP_SCREEN))).toBeVisible();
    });

    it('Show map screen from item screen', async () => {
      await element(by.id(`${ITEM_LIST_OPTIONS}-1`)).tap();

      await element(by.id(ITEM_LIST_OPTIONS_MAP)).tap();

      await expect(element(by.id(MAP_SCREEN))).toBeVisible();
    });
  });
});
