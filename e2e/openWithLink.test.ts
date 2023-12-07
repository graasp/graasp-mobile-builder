import { DiscriminatedItem } from '@graasp/sdk';

import { expect } from 'detox';

import {
  ITEM_SCREEN_ERROR,
  SCAN_QR_CODE_BUTTON,
  URL_INPUT,
  URL_INPUT_SUBMIT_BUTTON,
  buildItemsListTestId,
  buildPlayerButtonId,
} from './constants/testIds';
import { signIn } from './utils/auth';
import { openApp } from './utils/openApp';

const url =
  'https://library.stage.graasp.org/collections/9214ad4e-48ca-4aa5-9a9c-c9bfd4cb19d3';
const item: DiscriminatedItem = {
  id: '9214ad4e-48ca-4aa5-9a9c-c9bfd4cb19d3',
  name: 'Super sample collection',
} as DiscriminatedItem;

const expectBuilderFolderScreen = async (item: DiscriminatedItem) => {
  await expect(element(by.id(buildItemsListTestId(item.id)))).toBeVisible();
  await expect(element(by.id(buildItemsListTestId(item.id)))).toBeVisible();
  await expect(element(by.text(item.name))).toBeVisible();
  await expect(element(by.id(buildPlayerButtonId(item.id)))).toBeVisible();
};

describe('Camera QR Scan', () => {
  beforeEach(async () => {
    await openApp();
    await signIn();
  });

  it(`Camera redirect to item in builder mode`, async () => {
    await element(by.id(SCAN_QR_CODE_BUTTON)).tap();

    await expectBuilderFolderScreen(item);
  });
});

describe('Url input', () => {
  beforeEach(async () => {
    await openApp();
    await signIn();
  });

  it(`Url input redirects to item in builder mode`, async () => {
    await element(by.id(URL_INPUT)).typeText(url);

    await element(by.id(URL_INPUT_SUBMIT_BUTTON)).tap();

    await expectBuilderFolderScreen(item);
  });

  it(`Url input redirects to error item for incorrect/unknown id`, async () => {
    // we rely on the fact that no item with this id exists
    const wrongUrl = `https://library.stage.graasp.org/collections/ef97abd5-770c-46f0-b773-04fcc8945fea`;
    await element(by.id(URL_INPUT)).typeText(wrongUrl);

    await element(by.id(URL_INPUT_SUBMIT_BUTTON)).tap();

    await expect(element(by.id(ITEM_SCREEN_ERROR))).toBeVisible();
  });

  it(`Url input shows alert for incorrect url`, async () => {
    const wrongUrl = `https://library.stage.graasp.org/collections`;
    await element(by.id(URL_INPUT)).typeText(wrongUrl);

    await element(by.id(URL_INPUT_SUBMIT_BUTTON)).tap();

    // show alert and close it
    await element(by.text('OK')).tap();

    const nonGraaspUrl = `https://no.graasp.org/ef97abd5-770c-46f0-b773-04fcc8945fea`;
    await element(by.id(URL_INPUT)).clearText();
    await element(by.id(URL_INPUT)).typeText(nonGraaspUrl);

    await element(by.id(URL_INPUT_SUBMIT_BUTTON)).tap();

    // show alert and close it
    await element(by.text('OK')).tap();

    const noUrl = `some-text`;
    await element(by.id(URL_INPUT)).clearText();
    await element(by.id(URL_INPUT)).typeText(noUrl);

    await element(by.id(URL_INPUT_SUBMIT_BUTTON)).tap();

    // show alert and close it
    await element(by.text('OK')).tap();
  });
});
