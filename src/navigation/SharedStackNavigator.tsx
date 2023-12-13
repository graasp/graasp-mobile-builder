import { useTranslation } from 'react-i18next';

import { createStackNavigator } from '@react-navigation/stack';

import Header from '../components/common/Header';
import { defaultScreenOptions } from '../config/constants/navigation';
import SharedScreen from '../screens/SharedScreen';
import { SHARED_NAVIGATOR, SHARED_NAVIGATOR_SHARED } from './names';
import { SharedStackParamList } from './types';

const SharedStack = createStackNavigator<SharedStackParamList>();

const SharedStackNavigator = () => {
  const { t } = useTranslation();

  return (
    <SharedStack.Navigator
      id={SHARED_NAVIGATOR}
      initialRouteName={SHARED_NAVIGATOR_SHARED}
      screenOptions={defaultScreenOptions}
    >
      <SharedStack.Screen
        name={SHARED_NAVIGATOR_SHARED}
        component={SharedScreen}
        options={{
          title: '',
          headerLeft: () => <Header title={t('Shared Items')} />,
          headerLeftContainerStyle: { paddingLeft: 10 },
        }}
      />
    </SharedStack.Navigator>
  );
};

export default SharedStackNavigator;
