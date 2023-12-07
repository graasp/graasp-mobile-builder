import { useTranslation } from 'react-i18next';

import { createStackNavigator } from '@react-navigation/stack';

import Header from '../components/common/Header';
import { defaultScreenOptions } from '../config/constants/navigation';
import CollectionScreen from '../screens/library/CollectionScreen';
import LibraryScreen from '../screens/library/LibraryScreen';
import { LibraryStackParamList } from './types';

const Stack = createStackNavigator<LibraryStackParamList>();

const LibraryStackNavigator = () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      id="LibraryStackNavigator"
      initialRouteName="LibraryStack"
      screenOptions={defaultScreenOptions}
    >
      <Stack.Screen
        name="LibraryStack"
        component={LibraryScreen}
        options={{
          title: '',
          headerLeft: () => <Header title={t('Library')} />,
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="CollectionStack"
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
