import { useTranslation } from 'react-i18next';

import { createStackNavigator } from '@react-navigation/stack';

import { MY_ITEMS_MAP_BUTTON } from '../../e2e/constants/testIds';
import Header from '../components/common/Header';
import MapButton from '../components/common/MapButton';
import { defaultScreenOptions } from '../config/constants/navigation';
import MyItemsScreen from '../screens/MyItemsScreen';
import { MY_ITEMS_NAVIGATOR, MY_ITEMS_NAVIGATOR_MY_ITEMS } from './names';
import { MyItemsStackParamList } from './types';

const MyItemsStack = createStackNavigator<MyItemsStackParamList>();

const MyItemsStackNavigator = () => {
  const { t } = useTranslation();
  return (
    <MyItemsStack.Navigator
      id={MY_ITEMS_NAVIGATOR}
      initialRouteName={MY_ITEMS_NAVIGATOR_MY_ITEMS}
      screenOptions={defaultScreenOptions}
    >
      <MyItemsStack.Screen
        name={MY_ITEMS_NAVIGATOR_MY_ITEMS}
        component={MyItemsScreen}
        options={{
          title: '',
          headerLeft: () => <Header title={t('My Items')} />,
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRight: () => (
            <MapButton
              testId={MY_ITEMS_MAP_BUTTON}
              name={t('My Map')}
              color="white"
            />
          ),
        }}
      />
    </MyItemsStack.Navigator>
  );
};

export default MyItemsStackNavigator;
