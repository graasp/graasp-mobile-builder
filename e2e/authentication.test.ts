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
  ITEM_LIST_OPTIONS,
  ITEM_LIST_OPTIONS_DELETE,
  ITEM_LIST_OPTIONS_DETAILS,
  ITEM_LIST_OPTIONS_EDIT,
  MY_ITEMS_TAB,
  PDF_SHARE,
  SLEEP_TIME_HEAVY_ITEMS,
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

describe('Authentication', () => {
  beforeAll(async () => {
    await openApp();
    await element(by.id(MY_ITEMS_TAB)).tap();
  });

  it(`Sign In`, async () => {
    // create folder
    await createFolder(FOLDER_NAME);
  });
});
