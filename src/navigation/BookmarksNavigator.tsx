import { useTranslation } from 'react-i18next';

import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';

import Header from '../components/common/Header';
import { defaultScreenOptions } from '../config/constants/navigation';
import BookmarksScreen, {
  BookmarksStackProps,
} from '../screens/bookmarks/BookmarksScreen';

export type BookmarksStackParamList = {
  BookmarksStack: BookmarksStackProps;
};

export type BookmarksStackNavigationProp =
  StackNavigationProp<BookmarksStackProps>;
const Stack = createStackNavigator<BookmarksStackParamList>();

const BookmarksStackNavigator = () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      id="BookmarksStackNavigator"
      initialRouteName="BookmarksStack"
      screenOptions={defaultScreenOptions}
    >
      <Stack.Screen
        name="BookmarksStack"
        component={BookmarksScreen}
        options={{
          title: '',
          headerLeft: () => <Header title={t('Bookmarks')} />,
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default BookmarksStackNavigator;
