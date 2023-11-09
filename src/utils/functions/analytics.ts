import analytics from '@react-native-firebase/analytics';

export const customAnalyticsEvent = async (
  event: string,
  payload?: { [key: string]: any },
) => {
  try {
    await analytics().logEvent(event, payload);
  } catch (error) {
    throw new Error(`Analytics error\n${error}`);
  }
};
