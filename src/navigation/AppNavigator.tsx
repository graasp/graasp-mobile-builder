import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';

import { CurrentMemberProvider } from '../context/CurrentMemberContext';
import RootNavigator, { RootStackParamList } from './RootNavigator';

const AppNavigator = () => {
  const config = {
    screens: {
      SignIn: 'auth',
    },
  };

  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['https://mobile.graasp.org'],
    config,
  };

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <CurrentMemberProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <RootNavigator />
            <Toast />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </CurrentMemberProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;
