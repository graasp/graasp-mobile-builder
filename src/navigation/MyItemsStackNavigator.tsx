import { useTranslation } from 'react-i18next';

import { createStackNavigator } from '@react-navigation/stack';

import Header from '../components/common/Header';
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
        }}
      />
    </MyItemsStack.Navigator>
  );
};

export default MyItemsStackNavigator;
