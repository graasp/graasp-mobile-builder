import { expect } from 'detox';

import { ADD_ITEMS, CANCEL_CREATE_FOLDER, CONFIRM_CREATE_FOLDER, CONFIRM_DELETE_ITEM, CONFIRM_EDIT_ITEM, CREATE_FOLDER, EDIT_ITEM_NAME_INPUT, FOLDER_NAME_INPUT, IMAGE_SAVE, IMAGE_SHARE, ITEM_LIST_OPTIONS, ITEM_LIST_OPTIONS_DELETE, ITEM_LIST_OPTIONS_DETAILS, ITEM_LIST_OPTIONS_EDIT, PDF_SHARE, SLEEP_TIME_HEAVY_ITEMS, SLEEP_TIME_LIGHT_ITEMS, UNSUPPORTED_SHARE, VIDEO_SAVE, VIDEO_SHARE } from './constants/testIds';

import { openApp } from './utils/openApp';
import { sleep } from './utils/utils';

describe('Create, edit and delete item folder', () => {
  beforeAll(async () => {
    await openApp();
    await element(by.text('CRUD TEST')).tap();
  });

  it('Open "Create folder"', async () => {
    await element(by.id(ADD_ITEMS)).tap();
    await element(by.id(CREATE_FOLDER)).tap();
    await expect(element(by.id(FOLDER_NAME_INPUT))).toBeVisible();
    await expect(element(by.id(CONFIRM_CREATE_FOLDER))).toBeVisible();
    await expect(element(by.id(CANCEL_CREATE_FOLDER))).toBeVisible();
  });

  const folderName = 'Test folder by Detox';
  it(`Create new folder with name "${folderName}"`, async () => {
    await element(by.id(FOLDER_NAME_INPUT)).typeText(folderName);
    await element(by.id(CONFIRM_CREATE_FOLDER)).tap();
    await expect(element(by.id(ITEM_LIST_OPTIONS_EDIT))).not.toBeVisible();
    await expect(element(by.text(folderName))).toBeVisible();
  });

  it(`Edit folder name from "${folderName}" to "${folderName} 2"`, async () => {
    await element(by.id(`${ITEM_LIST_OPTIONS}-1`)).tap();
    await element(by.id(ITEM_LIST_OPTIONS_EDIT)).tap();
    await element(by.id(EDIT_ITEM_NAME_INPUT)).typeText(' 2');
    await element(by.id(CONFIRM_EDIT_ITEM)).tap();
    await element(by.id(`${ITEM_LIST_OPTIONS}-1`)).tap();
    await sleep(2000);
    await expect(element(by.text(`${folderName} 2`))).toBeVisible();
  });

  it(`Delete folder "${folderName} 2"`, async () => {
    await element(by.id(`${ITEM_LIST_OPTIONS}-1`)).tap();
    await element(by.id(ITEM_LIST_OPTIONS_DELETE)).tap();
    await element(by.id(CONFIRM_DELETE_ITEM)).tap();
    await sleep(2000);
    await expect(element(by.text(folderName))).not.toBeVisible();
  });
});

describe('Check item details screen', () => {
  beforeAll(async () => {
    await openApp();
    await element(by.text('DETAIL SCREEN TEST')).tap();
  });

  it('Check detail screen', async () => {
    await element(by.id(`${ITEM_LIST_OPTIONS}-1`)).tap();
    await element(by.id(ITEM_LIST_OPTIONS_DETAILS)).tap();
    await expect(element(by.text('Test detail screen'))).toBeVisible();
    await expect(element(by.text('Type'))).toBeVisible();
    await expect(element(by.text('folder'))).toBeVisible();
    await expect(element(by.text('Creator'))).toBeVisible();
    await expect(element(by.text('Alvaro'))).toBeVisible();
    await expect(element(by.text('Creation Date'))).toBeVisible();
    await expect(element(by.text('Last update'))).toBeVisible();
  });
});

describe('Check files are loaded (screenshots)', () => {
  beforeEach(async () => {
    await openApp();
    await element(by.text('ITEMS')).tap();
  });

  it('PDF', async () => {
    await element(by.text('pdf.pdf')).tap();
    await sleep(SLEEP_TIME_HEAVY_ITEMS);
    await device.takeScreenshot('PDF');
    await expect(element(by.id(PDF_SHARE))).toBeVisible();
    await element(by.id(PDF_SHARE)).tap();
    await sleep(SLEEP_TIME_HEAVY_ITEMS);
    await device.takeScreenshot('PDF share');
  });

  it('Image', async () => {
    await element(by.text('image.png')).tap();
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