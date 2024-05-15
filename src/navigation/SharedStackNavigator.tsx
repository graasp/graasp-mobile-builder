import { useTranslation } from 'react-i18next';

import { createStackNavigator } from '@react-navigation/stack';

import { SHARED_ITEMS_MAP_BUTTON } from '../../e2e/constants/testIds';
import Header from '../components/common/Header';
import MapButton from '../components/common/MapButton';
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
          headerRight: () => (
            <MapButton
              testId={SHARED_ITEMS_MAP_BUTTON}
              name={t('My Map')}
              color="white"
            />
          ),
        }}
      />
    </SharedStack.Navigator>
  );
};

export default SharedStackNavigator;
