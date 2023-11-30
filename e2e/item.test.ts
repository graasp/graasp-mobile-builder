import { expect } from 'detox';

import {
  ADD_ITEMS,
  CANCEL_CREATE_FOLDER,
  CONFIRM_CREATE_FOLDER,
  CONFIRM_DELETE_ITEM,
  CONFIRM_EDIT_ITEM,
  CREATE_FOLDER,
  EDIT_ITEM_NAME_INPUT,
  FOLDER_NAME_INPUT,
  IMAGE_SAVE,
  IMAGE_SHARE,
  ITEM_LIST_OPTIONS,
  ITEM_LIST_OPTIONS_DELETE,
  ITEM_LIST_OPTIONS_DETAILS,
  ITEM_LIST_OPTIONS_EDIT,
  MY_ITEMS_TAB,
  PDF_SHARE,
  SLEEP_TIME_HEAVY_ITEMS,
  SLEEP_TIME_LIGHT_ITEMS,
  UNSUPPORTED_SHARE,
  VIDEO_SAVE,
  VIDEO_SHARE,
} from './constants/testIds';
import { openApp } from './utils/openApp';
import { sleep } from './utils/utils';

const FOLDER_NAME = 'Test folder by Detox';

const createFolder = async (folderName: string) => {
  await element(by.id(ADD_ITEMS)).tap();
  await element(by.id(CREATE_FOLDER)).tap();
  await expect(element(by.id(FOLDER_NAME_INPUT))).toBeVisible();
  await expect(element(by.id(CONFIRM_CREATE_FOLDER))).toBeVisible();
  await expect(element(by.id(CANCEL_CREATE_FOLDER))).toBeVisible();
  await element(by.id(FOLDER_NAME_INPUT)).typeText(folderName);
  await element(by.id(CONFIRM_CREATE_FOLDER)).tap();
  await expect(element(by.id(ITEM_LIST_OPTIONS_EDIT))).not.toBeVisible();
  await expect(element(by.text(folderName))).toBeVisible();
};

describe('Create, edit and delete item folder', () => {
  beforeAll(async () => {
    await openApp();
    await element(by.id(MY_ITEMS_TAB)).tap();
  });

  it(`Create new folder with name "${FOLDER_NAME}"`, async () => {
    // create folder
    await createFolder(FOLDER_NAME);
  });

  it(`Edit folder name from "${FOLDER_NAME}" to "${FOLDER_NAME} 2"`, async () => {
    await element(by.id(`${ITEM_LIST_OPTIONS}-1`)).tap();
    await element(by.id(ITEM_LIST_OPTIONS_EDIT)).tap();
    await element(by.id(EDIT_ITEM_NAME_INPUT)).typeText(' 2');
    await element(by.id(CONFIRM_EDIT_ITEM)).tap();
    await element(by.id(`${ITEM_LIST_OPTIONS}-1`)).tap();
    await sleep(2000);
    await expect(element(by.text(`${FOLDER_NAME} 2`))).toBeVisible();
  });

  it(`Delete folder "${FOLDER_NAME} 2"`, async () => {
    await element(by.id(`${ITEM_LIST_OPTIONS}-1`)).tap();
    await element(by.id(ITEM_LIST_OPTIONS_DELETE)).tap();
    await element(by.id(CONFIRM_DELETE_ITEM)).tap();
    await sleep(2000);
    await expect(element(by.text(FOLDER_NAME))).not.toBeVisible();
  });
});

describe('Check item details screen', () => {
  beforeAll(async () => {
    await openApp();
  });

  it('Check detail screen', async () => {
    await element(by.id(MY_ITEMS_TAB)).tap();
    const name = 'my new folder-' + Date.now();
    await createFolder(name);

    await element(by.id(`${ITEM_LIST_OPTIONS}-1`)).tap();
    await element(by.id(ITEM_LIST_OPTIONS_DETAILS)).tap();
    await expect(element(by.text(name))).toBeVisible();
    await expect(element(by.text('Type'))).toBeVisible();
    await expect(element(by.text('folder'))).toBeVisible();
    await expect(element(by.text('Creator'))).toBeVisible();
    await expect(element(by.text('Creation Date'))).toBeVisible();
    await expect(element(by.text('Last update'))).toBeVisible();
  });
});

describe('Check files are loaded (screenshots)', () => {
  beforeEach(async () => {
    await openApp();
    await element(by.id(MY_ITEMS_TAB)).tap();
  });

  it('PDF', async () => {
    await element(by.text('pdf.pdf')).tap();
    await sleep(SLEEP_TIME_HEAVY_ITEMS);
    await expect(element(by.id(PDF_SHARE))).toBeVisible();
    await device.takeScreenshot('PDF');
    await element(by.id(PDF_SHARE)).tap();
    await sleep(SLEEP_TIME_HEAVY_ITEMS);
    await device.takeScreenshot('PDF share');
  });

  it('Image', async () => {
    await element(by.text('img.png')).tap();
    await sleep(SLEEP_TIME_LIGHT_ITEMS);
    await device.takeScreenshot('Image');
    await expect(element(by.id(IMAGE_SHARE))).toBeVisible();
    await expect(element(by.id(IMAGE_SAVE))).toBeVisible();
    await element(by.id(IMAGE_SHARE)).tap();
    await sleep(SLEEP_TIME_LIGHT_ITEMS);
    await device.takeScreenshot('Image share');
  });

  it('Video', async () => {
    await element(by.text('video.mp4')).tap();
    await sleep(SLEEP_TIME_HEAVY_ITEMS);
    await device.takeScreenshot('Video');
    await expect(element(by.id(VIDEO_SHARE))).toBeVisible();
    await expect(element(by.id(VIDEO_SAVE))).toBeVisible();
    await element(by.id(VIDEO_SHARE)).tap();
    await sleep(SLEEP_TIME_HEAVY_ITEMS);
    await device.takeScreenshot('Video share');
  });

  it('Unsupported item', async () => {
    await element(by.text('webp.webp')).tap();
    await device.takeScreenshot('Unsupported item');
    await element(by.id(UNSUPPORTED_SHARE)).tap();
    await device.takeScreenshot('Unsupported share');
  });
});
