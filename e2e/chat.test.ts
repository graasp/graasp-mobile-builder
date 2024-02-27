import { expect } from 'detox';

import {
  CHAT_BUTTON_HEADER,
  CHAT_INPUT_TEXT,
  CHAT_MESSAGE_OPTIONS_CANCEL_EDIT,
  CHAT_MESSAGE_OPTIONS_DELETE,
  CHAT_MESSAGE_OPTIONS_EDIT,
  CHAT_SEND_BUTTON,
  CHAT_WRAPPER,
  MY_ITEMS_TAB,
  SLEEP_TIME_MINIMUM,
  buildChatMentionMemberId,
  buildChatMessageId,
  buildTestFolderChatId,
} from './constants/testIds';
import { signIn } from './utils/auth';
import { openApp } from './utils/openApp';
import { createFolder, sleep, tapOnTopChat } from './utils/utils';
import fixtures from './fixtures/stage/structure';

const testDate = Date.now().toString();
const TEST_CHAT_FOLDER = buildTestFolderChatId(testDate);
const CHAT_MEMBER = fixtures.members[0].name;
const MESSAGE_TEXT = 'Message';
const MODIFIED_TEXT = '-modified';
const MARKDOWN_TEXT_IMAGE = `![graasp image](https://picsum.photos/500)`;
const MARKDOWN_TEXT_LINK = `[Link test](https://graasp.org)`;
const MARKDOWN_TEXT = `
# Titre
## Sous titre

Ceci est un example de ~message~ chat sur **Graasp**, une plateforme d'éducation *digitale* disponible [ici](https://graasp.org).

List de choses:
- chose 1
- chose 2
  - sous chose

List ordonnée: 
1. se créer un compte
2. créer des resources
3. partager !

La première chose que l'on écrit est en général:

py
print('hello world')


> Note: un message
`;

describe('Chat test', () => {
  beforeAll(async () => {
    await openApp();
    await signIn();
    await element(by.id(MY_ITEMS_TAB)).tap();
    await createFolder(TEST_CHAT_FOLDER);
    await element(by.text(TEST_CHAT_FOLDER)).tap();
  });

  afterEach(async () => {
    // Tap on the screen to close the keyboard
    await tapOnTopChat();
  });

  it(`Show chat`, async () => {
    await element(by.id(CHAT_BUTTON_HEADER)).tap();
    await sleep(SLEEP_TIME_MINIMUM);
    await expect(element(by.id(CHAT_WRAPPER))).toBeVisible();
  });

  it(`Send a message`, async () => {
    await element(by.id(CHAT_INPUT_TEXT)).tap();
    await element(by.id(CHAT_INPUT_TEXT)).typeText(MESSAGE_TEXT);
    await element(by.id(CHAT_SEND_BUTTON)).tap();
    await sleep(SLEEP_TIME_MINIMUM);
    await expect(element(by.text(MESSAGE_TEXT))).toBeVisible();
  });

  it(`Edit a message`, async () => {
    await element(by.id(buildChatMessageId(MESSAGE_TEXT))).tap();
    await element(by.id(CHAT_MESSAGE_OPTIONS_EDIT)).tap();
    await element(by.id(CHAT_INPUT_TEXT)).typeText(MODIFIED_TEXT);
    await element(by.id(CHAT_SEND_BUTTON)).tap();
    await sleep(SLEEP_TIME_MINIMUM);
    await expect(element(by.id(CHAT_INPUT_TEXT))).toHaveText('');
    await expect(element(by.text(`${MESSAGE_TEXT}${MODIFIED_TEXT}`))).toBeVisible();
  });

  it(`Cancel edit a message`, async () => {
    await element(by.id(buildChatMessageId(`${MESSAGE_TEXT}${MODIFIED_TEXT}`))).tap();
    await element(by.id(CHAT_MESSAGE_OPTIONS_EDIT)).tap();
    await element(by.id(CHAT_MESSAGE_OPTIONS_CANCEL_EDIT)).tap();
    await sleep(SLEEP_TIME_MINIMUM);
    await expect(element(by.id(CHAT_INPUT_TEXT))).toHaveText('');
  });

  it(`Delete a message`, async () => {
    const MESSAGE_DELETED_TEXT = 'Message-to-be-deleted';
    await element(by.id(CHAT_INPUT_TEXT)).tap();
    await element(by.id(CHAT_INPUT_TEXT)).typeText(MESSAGE_DELETED_TEXT);
    await element(by.id(CHAT_SEND_BUTTON)).tap();
    await tapOnTopChat();    
    await sleep(SLEEP_TIME_MINIMUM);
    await device.takeScreenshot('Message before deletion');
    await element(by.id(buildChatMessageId(MESSAGE_DELETED_TEXT))).tap();
    await element(by.id(CHAT_MESSAGE_OPTIONS_DELETE)).tap();
    await sleep(SLEEP_TIME_MINIMUM);
    await expect(element(by.text(MESSAGE_DELETED_TEXT))).not.toBeVisible();
    await device.takeScreenshot('Message after deletion');
  });

  it(`Send a message with mention`, async () => {
    await element(by.id(CHAT_INPUT_TEXT)).tap();
    await element(by.id(CHAT_INPUT_TEXT)).typeText(`Mention @${CHAT_MEMBER.substring(0, 2)}`);
    await element(by.id(buildChatMentionMemberId(CHAT_MEMBER))).tap();
    await element(by.id(CHAT_SEND_BUTTON)).tap();
    await sleep(SLEEP_TIME_MINIMUM);
    await expect(element(by.id(CHAT_INPUT_TEXT))).toHaveText('');
    await expect(element(by.text(`Mention @${CHAT_MEMBER}`))).toBeVisible();
  });

  it(`Send a message with markdown image`, async () => {
    await element(by.id(CHAT_INPUT_TEXT)).tap();
    await element(by.id(CHAT_INPUT_TEXT)).typeText(MARKDOWN_TEXT_IMAGE);
    await element(by.id(CHAT_SEND_BUTTON)).tap();
    await sleep(SLEEP_TIME_MINIMUM);
    await expect(element(by.id(CHAT_INPUT_TEXT))).toHaveText('');
    await expect(element(by.text(MARKDOWN_TEXT_IMAGE))).not.toBeVisible();
    await tapOnTopChat();    
    await device.takeScreenshot('Message with markdown image');
  });

  it(`Send a message with markdown link`, async () => {
    await element(by.id(CHAT_INPUT_TEXT)).tap();
    await element(by.id(CHAT_INPUT_TEXT)).typeText(MARKDOWN_TEXT_LINK);
    await element(by.id(CHAT_SEND_BUTTON)).tap();
    await sleep(SLEEP_TIME_MINIMUM);
    await expect(element(by.id(CHAT_INPUT_TEXT))).toHaveText('');
    await expect(element(by.text(MARKDOWN_TEXT_LINK))).not.toBeVisible();
    await tapOnTopChat();    
    await device.takeScreenshot('Message with markdown link');
  });

  it(`Send a message with markdown`, async () => {
    await element(by.id(CHAT_INPUT_TEXT)).tap();
    await element(by.id(CHAT_INPUT_TEXT)).typeText(MARKDOWN_TEXT);
    await element(by.id(CHAT_SEND_BUTTON)).tap();
    await sleep(SLEEP_TIME_MINIMUM);
    await tapOnTopChat();    
    await device.takeScreenshot('Message with markdown');
  });
});
