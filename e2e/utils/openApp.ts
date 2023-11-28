import { SLEEP_TIME_OPEN_APP } from "../constants/testIds";
import { getAppId, sleep } from "./utils";

const { resolveConfig } = require('detox/internals');

const platform = device.getPlatform();

export const openApp = async () => {
  const { configurationName } = await resolveConfig();
  if (configurationName.split('.')[1] === 'debug') {
    return await openAppForDebugBuild(platform);
  } else {
    return await device.launchApp({
      newInstance: true,
    });
  }
};

async function openAppForDebugBuild(platform: string) {
  const deepLinkUrl = process.env.EXPO_USE_UPDATES
    ? // Testing latest published EAS update for the test_debug channel
      getDeepLinkUrl(getLatestUpdateUrl())
    : // Local testing with packager
      getDeepLinkUrl(getDevLauncherPackagerUrl(platform));

  if (platform === 'ios') {
    await device.launchApp({
      newInstance: true,
    });
    sleep(SLEEP_TIME_OPEN_APP);
    await device.openURL({
      url: deepLinkUrl,
    });
  } else {
    await device.launchApp({
      newInstance: true,
      url: deepLinkUrl,
    });
  }

  await sleep(SLEEP_TIME_OPEN_APP);
}

const getDeepLinkUrl = (url: string) =>
  `exp+graasp-mobile-builder://expo-development-client/?url=${encodeURIComponent(url)}`;

const getDevLauncherPackagerUrl = (platform: string) =>
  `http://localhost:8081?platform=${platform}&dev=true&minify=false&disableOnboarding=1`;

const getLatestUpdateUrl = () =>
  `https://u.expo.dev/${getAppId()}?channel-name=test_debug&disableOnboarding=1`;
  