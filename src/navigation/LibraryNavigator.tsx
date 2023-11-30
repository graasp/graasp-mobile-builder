import { useTranslation } from 'react-i18next';

import { DiscriminatedItem } from '@graasp/sdk';

import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';

import Header from '../components/common/Header';
import { defaultScreenOptions } from '../config/constants/navigation';
import CollectionHeader from '../screens/library/CollectionHeader';
import CollectionScreen from '../screens/library/CollectionScreen';
import LibraryScreen, {
  LibraryStackProps,
} from '../screens/library/LibraryScreen';

export type LibraryStackParamList = {
  LibraryStack: LibraryStackProps;
  CollectionStack: { itemId: DiscriminatedItem['id'] };
};

export type LibraryStackNavigationProp =
  StackNavigationProp<LibraryStackParamList>;
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
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="CollectionStack"
        component={CollectionScreen}
        options={({
          route: {
            params: { itemId },
          },
        }) => ({
          title: '',
          headerLeft: () => <CollectionHeader itemId={itemId} />,
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};

export default LibraryStackNavigator;
