import { expect } from 'detox';

import {
  ADD_ITEMS,
  ITEM_LIST,
  ITEM_LIST_OPTIONS,
  ITEM_LIST_OPTIONS_DELETE,
  ITEM_LIST_OPTIONS_DETAILS,
  ITEM_LIST_OPTIONS_EDIT,
  ITEM_LIST_OPTIONS_SHARE,
  SHARED_ITEMS_TAB,
} from './constants/testIds';
import FIXTURES from './fixtures/stage/structure.json';
import { openApp } from './utils/openApp';

describe('Check item options with ADMIN membership', () => {
  const { idx } = FIXTURES.items.find(
    ({ name }) => name === 'folder with admin permission',
  )!;

  beforeAll(async () => {
    await openApp();
    await element(by.id(SHARED_ITEMS_TAB)).tap();
    await element(by.id(`${ITEM_LIST_OPTIONS}-${idx}`)).tap();
  });

  it('"Details" option should be visible for admin rights', async () => {
    await expect(element(by.id(ITEM_LIST_OPTIONS_DETAILS))).toBeVisible();
  });

  it('"Edit" option should be visible for admin rights', async () => {
    await expect(element(by.id(ITEM_LIST_OPTIONS_EDIT))).toBeVisible();
  });

  it('"Delete" option should be visible for admin rights', async () => {
    await expect(element(by.id(ITEM_LIST_OPTIONS_DELETE))).toBeVisible();
  });

  it('"Share" option should be visible for admin rights', async () => {
    await expect(element(by.id(ITEM_LIST_OPTIONS_SHARE))).toBeVisible();
  });

  it('"Add item" shoud be visible for admin rights', async () => {
    await element(by.id(`${ITEM_LIST}-${idx}`)).tap();
    await element(by.id(`${ITEM_LIST}-${idx}`)).tap();
    await expect(element(by.id(ADD_ITEMS))).toBeVisible();
  });
});

describe('Check item options with WRITE membership', () => {
  const { idx } = FIXTURES.items.find(
    ({ name }) => name === 'folder with write permission',
  )!;
  beforeAll(async () => {
    await openApp();
    await element(by.id(SHARED_ITEMS_TAB)).tap();
    await element(by.id(`${ITEM_LIST_OPTIONS}-${idx}`)).tap();
  });

  it('"Details" option should be visible for write rights', async () => {
    await expect(element(by.id(ITEM_LIST_OPTIONS_DETAILS))).toBeVisible();
  });

  it('"Edit" option should be visible for write rights', async () => {
    await expect(element(by.id(ITEM_LIST_OPTIONS_EDIT))).toBeVisible();
  });

  it('"Delete" option should be visible for write rights', async () => {
    await expect(element(by.id(ITEM_LIST_OPTIONS_DELETE))).toBeVisible();
  });

  it('"Share" option should be visible for write rights', async () => {
    await expect(element(by.id(ITEM_LIST_OPTIONS_SHARE))).toBeVisible();
  });

  it('"Add item" shoud be visible for write rights', async () => {
    await element(by.id(`${ITEM_LIST}-${idx}`)).tap();
    await element(by.id(`${ITEM_LIST}-${idx}`)).tap();
    await expect(element(by.id(ADD_ITEMS))).toBeVisible();
  });
});

describe('Check item options with READ membership', () => {
  const { idx } = FIXTURES.items.find(
    ({ name }) => name === 'folder with read permission',
  )!;
  beforeAll(async () => {
    await openApp();
    await element(by.id(SHARED_ITEMS_TAB)).tap();
    await element(by.id(`${ITEM_LIST_OPTIONS}-${idx}`)).tap();
  });

  it('"Details" option should be visible for read rights', async () => {
    await expect(element(by.id(ITEM_LIST_OPTIONS_DETAILS))).toBeVisible();
  });

  it('"Edit" option should NOT be visible for read rights', async () => {
    await expect(element(by.id(ITEM_LIST_OPTIONS_EDIT))).not.toBeVisible();
  });

  it('"Delete" option should NOT be visible for read rights', async () => {
    await expect(element(by.id(ITEM_LIST_OPTIONS_DELETE))).not.toBeVisible();
  });

  it('"Share" option should be visible for read rights', async () => {
    await expect(element(by.id(ITEM_LIST_OPTIONS_SHARE))).toBeVisible();
  });

  it('"Add item" shoud NOT be visible for read rights', async () => {
    await element(by.id(`${ITEM_LIST}-${idx}`)).tap();
    await element(by.id(`${ITEM_LIST}-${idx}`)).tap();
    await expect(element(by.id(ADD_ITEMS))).not.toBeVisible();
  });
});
