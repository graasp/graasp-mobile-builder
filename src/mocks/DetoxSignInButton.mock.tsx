import { Button } from 'react-native-elements';

import * as SecureStore from 'expo-secure-store';

import { DETOX_SIGN_IN_BUTTON } from '../../e2e/constants/testIds';
import { SECURE_STORE_VALUES } from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';

const DetoxSignInButton = () => {
  const { hooks } = useQueryClient();
  const { refetch } = hooks.useCurrentMember();

  const onPress = async () => {
    // necessary for test and login by default
    if (!process.env.EXPO_PUBLIC_TEST_REFRESH_TOKEN) {
      return alert('EXPO_PUBLIC_TEST_REFRESH_TOKEN is not set!');
    } else {
      await SecureStore.setItemAsync(
        SECURE_STORE_VALUES.REFRESH_TOKEN,
        process.env.EXPO_PUBLIC_TEST_REFRESH_TOKEN,
      );

      refetch();
    }
  };

  return (
    <Button
      title={'Set refresh token & reload'}
      raised={true}
      onPress={onPress}
      testID={DETOX_SIGN_IN_BUTTON}
    />
  );
};

export default DetoxSignInButton;
