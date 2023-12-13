import { DiscriminatedItem } from '@graasp/sdk';

import { expect } from 'detox';

import {
  ITEM_NAVIGATOR_ITEM_ERROR,
  SCAN_QR_CODE_BUTTON,
  URL_INPUT,
  URL_INPUT_SUBMIT_BUTTON,
  buildItemsListTestId,
  buildPlayerButtonId,
} from './constants/testIds';
import FIXTURES from './fixtures/stage/structure';
import { signIn } from './utils/auth';
import { openApp } from './utils/openApp';

const item = FIXTURES.items[3] as unknown as DiscriminatedItem;
const libraryUrl = `${process.env.EXPO_PUBLIC_LIBRARY_HOST}/collections/${item.id}`;

// we rely on the fact that no item with this id exists
const wrongUrl = `${process.env.EXPO_PUBLIC_LIBRARY_HOST}/collections/ef97abd5-770c-46f0-b773-04fcc8945fea`;

const notAnItemUrl = `${process.env.EXPO_PUBLIC_LIBRARY_HOST}/collections`;
const nonGraaspUrl = `https://no.graasp.org/ef97abd5-770c-46f0-b773-04fcc8945fea`;

const expectBuilderFolderScreen = async (item: {
  id: string;
  name: string;
}) => {
  await expect(element(by.id(buildItemsListTestId(item.id)))).toBeVisible();
  await expect(element(by.id(buildItemsListTestId(item.id)))).toBeVisible();
  await expect(element(by.text(item.name))).toBeVisible();
  await expect(element(by.id(buildPlayerButtonId(item.id)))).toBeVisible();
};

describe('Camera QR Scan', () => {
  it(`Camera redirect to item in builder mode`, async () => {
    await openApp({ launchArgs: { cameraItemUrl: libraryUrl } });
    await signIn();
    await element(by.id(SCAN_QR_CODE_BUTTON)).tap();

    await expectBuilderFolderScreen(item);
  });

  it(`Url input redirects to error item for incorrect/unknown id`, async () => {
    await openApp({ launchArgs: { cameraItemUrl: wrongUrl } });
    await signIn();

    await element(by.id(SCAN_QR_CODE_BUTTON)).tap();

    await expect(element(by.id(ITEM_NAVIGATOR_ITEM_ERROR))).toBeVisible();
  });

  it(`Url input shows alert for incorrect url`, async () => {
    await openApp({ launchArgs: { cameraItemUrl: notAnItemUrl } });
    await signIn();

    await element(by.id(SCAN_QR_CODE_BUTTON)).tap();

    // show alert
    // duplicate because of mock
    await expect(element(by.text('OK')).atIndex(0)).toBeVisible();
  });

  it(`Url input shows alert for non-graasp url`, async () => {
    await openApp({ launchArgs: { cameraItemUrl: nonGraaspUrl } });
    await signIn();

    await element(by.id(SCAN_QR_CODE_BUTTON)).tap();

    // show alert
    // duplicate because of mock
    await expect(element(by.text('OK')).atIndex(0)).toBeVisible();
  });

  it(`Url input shows alert for non url`, async () => {
    const noUrl = `some-text`;
    await openApp({ launchArgs: { cameraItemUrl: noUrl } });
    await signIn();

    await element(by.id(SCAN_QR_CODE_BUTTON)).tap();

    // show alert
    // duplicate because of mock
    await expect(element(by.text('OK')).atIndex(0)).toBeVisible();
  });
});

describe('Url input', () => {
  beforeEach(async () => {
    await openApp();
    await signIn();
  });

  it(`Url input redirects to item in builder mode`, async () => {
    await element(by.id(URL_INPUT)).typeText(libraryUrl);

    await element(by.id(URL_INPUT_SUBMIT_BUTTON)).tap();

    await expectBuilderFolderScreen(item);
  });

  it(`Url input redirects to error item for incorrect/unknown id`, async () => {
    await element(by.id(URL_INPUT)).typeText(wrongUrl);

    await element(by.id(URL_INPUT_SUBMIT_BUTTON)).tap();

    await expect(element(by.id(ITEM_NAVIGATOR_ITEM_ERROR))).toBeVisible();
  });

  it(`Url input shows alert for incorrect url`, async () => {
    await element(by.id(URL_INPUT)).typeText(notAnItemUrl);

    await element(by.id(URL_INPUT_SUBMIT_BUTTON)).tap();

    // show alert and close it
    await element(by.text('OK')).tap();

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
