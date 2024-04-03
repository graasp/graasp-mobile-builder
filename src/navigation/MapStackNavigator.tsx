import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import { createStackNavigator } from '@react-navigation/stack';

import Header from '../components/common/Header';
import { defaultScreenOptions } from '../config/constants/navigation';
import { API_HOST, BUILDER_HOST } from '../config/env';
import { useAuth } from '../context/AuthContext';
import CollectionScreen from '../screens/library/CollectionScreen';
import {
  LIBRARY_NAVIGATOR,
  LIBRARY_NAVIGATOR_COLLECTION,
  LIBRARY_NAVIGATOR_LIBRARY,
} from './names';
import { LibraryStackParamList } from './types';

const Stack = createStackNavigator<LibraryStackParamList>();

const MapStackNavigator = () => {
  const { t } = useTranslation();
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { userToken } = useAuth();

  return (
    <Stack.Navigator
      id={LIBRARY_NAVIGATOR}
      initialRouteName="LibraryStack"
      screenOptions={defaultScreenOptions}
    >
      <Stack.Screen
        name={LIBRARY_NAVIGATOR_LIBRARY}
        component={() => {
          return (
            <WebView
              source={{
                uri: `${API_HOST}/m/auth/web?t=${userToken}&url=${BUILDER_HOST}/map`,
              }}
              scalesPageToFit={false}
              startInLoadingState={true}
              overScrollMode="never"
              javaScriptEnabled={true}
              cacheEnabled={true}
              style={{
                width: dimensions.width - insets.left,
                height: '100%',
                marginLeft: insets.left,
                marginRight: insets.right,
              }}
            />
          );
        }}
        options={{
          title: '',
          headerLeft: () => <Header title={t('Library')} />,
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name={LIBRARY_NAVIGATOR_COLLECTION}
        component={CollectionScreen}
        getId={({ params }) => {
          return params?.itemId;
        }}
        options={() => ({
          title: '',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};

export default MapStackNavigator;
