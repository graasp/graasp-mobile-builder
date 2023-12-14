import { expect } from 'detox';

import {
  PLAYER_FOLDER_MENU,
  URL_INPUT,
  URL_INPUT_SUBMIT_BUTTON,
  buildItemsListTestId,
  buildPlayerButtonId,
  buildPlayerFolderMenuItem,
  buildPlayerViewCloseButton,
} from './constants/testIds';
import FIXTURES from './fixtures/stage/structure';
import { signIn } from './utils/auth';
import { openApp } from './utils/openApp';

const item = FIXTURES.items[4] as unknown as {
  id: string;
  name: string;
  children: { id: string }[];
};

describe('Player View', () => {
  it(`Navigating in children in player mode from builder exits to root item in builder view`, async () => {
    await openApp();
    await signIn();
    const url = `${process.env.EXPO_PUBLIC_BUILDER_HOST}/items/${item.id}`;

    await element(by.id(URL_INPUT)).typeText(url);

    await element(by.id(URL_INPUT_SUBMIT_BUTTON)).tap();
    await element(by.id(buildPlayerButtonId(item.id))).tap();
    await element(by.id(PLAYER_FOLDER_MENU)).tap();
    await element(by.id(buildPlayerFolderMenuItem(item.children[0].id))).tap();
    await element(by.id(buildPlayerViewCloseButton(item.children[0].id))).tap();

    await expect(element(by.text(item.name))).toBeVisible();
    await expect(element(by.id(buildItemsListTestId(item.id)))).toBeVisible();
  });
});
