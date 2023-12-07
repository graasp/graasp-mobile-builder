import { expect } from 'detox';

import {
  DETOX_SIGN_IN_BUTTON,
  LOG_OUT_BUTTON,
  PROFILE_TAB,
} from '../constants/testIds';

export const signOut = async () => {
  await element(by.id(PROFILE_TAB)).tap();
  await element(by.id(LOG_OUT_BUTTON)).tap();
};

// sign in only if debug button is visible
export const signIn = async () => {
  try {
    await expect(element(by.id(DETOX_SIGN_IN_BUTTON))).toBeVisible();
    await element(by.id(DETOX_SIGN_IN_BUTTON)).tap();
  } catch (e) {
    console.log('user is already signed in');
    console.error(e);
  }
};
