import { useTranslation } from 'react-i18next';

import { createStackNavigator } from '@react-navigation/stack';

import Header from '../components/common/Header';
import { defaultScreenOptions } from '../config/constants/navigation';
import CollectionScreen from '../screens/library/CollectionScreen';
import LibraryScreen from '../screens/library/LibraryScreen';
import {
  LIBRARY_NAVIGATOR,
  LIBRARY_NAVIGATOR_COLLECTION,
  LIBRARY_NAVIGATOR_LIBRARY,
} from './names';
import { LibraryStackParamList } from './types';

const Stack = createStackNavigator<LibraryStackParamList>();

const LibraryStackNavigator = () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      id={LIBRARY_NAVIGATOR}
      initialRouteName="LibraryStack"
      screenOptions={defaultScreenOptions}
    >
      <Stack.Screen
        name={LIBRARY_NAVIGATOR_LIBRARY}
        component={LibraryScreen}
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

export default LibraryStackNavigator;
