import { expect } from 'detox';

import { ADD_ITEMS, CANCEL_CREATE_FOLDER, CHAT_WRAPPER, CONFIRM_CREATE_FOLDER, CREATE_FOLDER, FOLDER_NAME_INPUT, ITEM_LIST_OPTIONS_EDIT } from "../constants/testIds";

const appConfig = require('../../app.config.js');

export const getAppId = () => appConfig?.expo?.extra?.eas?.projectId ?? '';

export const sleep = (t: number) => new Promise(res => setTimeout(res, t));

export const tapOnTopChat = async () => await element(by.id(CHAT_WRAPPER)).tap({x: 1, y: 1});

export const createFolder = async (folderName: string) => {
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
