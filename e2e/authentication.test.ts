import { expect } from 'detox';

import {
  PROFILE_TAB,
  SIGN_IN_BUTTON,
  SIGN_IN_LATER_BUTTON,
  SIGN_IN_TAB,
  URL_INPUT,
} from './constants/testIds';
import { signIn, signOut } from './utils/auth';
import { openApp } from './utils/openApp';

describe('Authentication', () => {
  it('Login goes to home page & Logout should return to sign in screen', async () => {
    await openApp();

    await signIn();

    // goes to home
    await expect(element(by.id(URL_INPUT))).toBeVisible();
    await expect(element(by.id(PROFILE_TAB))).toBeVisible();

    // !! we don't logout !!
  });

  // this test cannot be played alone, it requires to be logged in at the beginning of the app
  it('On open, user is signed in and goes to main directly', async () => {
    await openApp();

    // show  home with input url
    await expect(element(by.id(URL_INPUT))).toBeVisible();

    await signOut();
    await expect(element(by.id(SIGN_IN_BUTTON))).toBeVisible();
  });

  describe('Start log out', () => {
    beforeEach(async () => {
      await openApp();
    });

    it('On open logged out user stay on sign in screen', async () => {
      await expect(element(by.id(SIGN_IN_BUTTON))).toBeVisible();

      await element(by.id(SIGN_IN_LATER_BUTTON)).tap();

      await element(by.id(SIGN_IN_TAB)).tap();
      await expect(element(by.id(SIGN_IN_BUTTON))).toBeVisible();
    });
  });
});
