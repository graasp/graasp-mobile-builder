import { expect } from 'detox';

import {
  SCAN_QR_CODE_BUTTON,
  URL_INPUT,
  URL_INPUT_SUBMIT_BUTTON,
  buildItemsListTestId,
} from './constants/testIds';
import { signIn } from './utils/auth';
import { openApp } from './utils/openApp';

const url =
  'https://library.stage.graasp.org/collections/9214ad4e-48ca-4aa5-9a9c-c9bfd4cb19d3';
const item = {
  id: '9214ad4e-48ca-4aa5-9a9c-c9bfd4cb19d3',
  name: 'Super sample collection',
};

describe('Camera QR Scan', () => {
  beforeEach(async () => {
    await openApp();
    await signIn();
  });

  it(`Camera redirect to item in builder mode`, async () => {
    await element(by.id(SCAN_QR_CODE_BUTTON)).tap();
    await expect(element(by.id(buildItemsListTestId(item.id)))).toBeVisible();
    await expect(element(by.id(buildItemsListTestId(item.id)))).toBeVisible();
    await expect(element(by.text(item.name))).toBeVisible();
  });
});

describe('Url input', () => {
  beforeEach(async () => {
    await openApp();
    await signIn();
  });

  it.only(`Url input redirect to item in builder mode`, async () => {
    await element(by.id(URL_INPUT)).typeText(url);

    await element(by.id(URL_INPUT_SUBMIT_BUTTON)).tap();

    await expect(element(by.id(buildItemsListTestId(item.id)))).toBeVisible();
    await expect(element(by.id(buildItemsListTestId(item.id)))).toBeVisible();
    await expect(element(by.text(item.name))).toBeVisible();
  });
});
