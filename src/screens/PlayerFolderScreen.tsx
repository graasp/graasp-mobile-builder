import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MaterialIcons } from '@expo/vector-icons';

import { Context } from '@graasp/sdk';

import { useNavigation, useRoute } from '@react-navigation/native';

import { buildPlayerViewCloseButton } from '../../e2e/constants/testIds';
import ActivityIndicator from '../components/ActivityIndicator';
import PlayerView from '../components/PlayerView';
import { PLAYER_COLOR } from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import {
  ITEM_NAVIGATOR,
  ITEM_NAVIGATOR_ITEM,
  LIBRARY_NAVIGATOR_COLLECTION,
  MY_ITEMS_NAVIGATOR_MY_ITEMS,
  TAB_NAVIGATOR_LIBRARY,
  TAB_NAVIGATOR_MY_ITEMS,
} from '../navigation/names';
import { ItemScreenProps } from '../navigation/types';
import { useFocusQuery } from '../utils/functions/useQuery';

const PlayerFolderScreen = (): JSX.Element | null => {
  const route = useRoute<ItemScreenProps<'ItemStackPlayerFolder'>['route']>();
  const { itemId, origin } = route.params;
  const { hooks } = useQueryClient();
  const {
    data: children,
    isLoading,
    isError,
    refetch,
  } = hooks.useChildren(itemId);
  useFocusQuery(refetch);
  const navigation =
    useNavigation<ItemScreenProps<'ItemStackPlayerFolder'>['navigation']>();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: PLAYER_COLOR,
      },
      headerRight: () => (
        <Button
          buttonStyle={{ backgroundColor: PLAYER_COLOR }}
          testID={buildPlayerViewCloseButton(itemId)}
          icon={
            <MaterialIcons
              name={'close'}
              color="#fff"
              size={25}
              style={{ paddingRight: 3, backgroundColor: PLAYER_COLOR }}
            />
          }
          onPress={() => {
            if (origin.context === Context.Builder) {
              return navigation.navigate(ITEM_NAVIGATOR, {
                screen: ITEM_NAVIGATOR_ITEM,
                params: { itemId: origin.rootId },
              });
            } else if (origin.context === Context.Library) {
              return navigation.navigate(TAB_NAVIGATOR_LIBRARY, {
                screen: LIBRARY_NAVIGATOR_COLLECTION,
                params: { itemId: origin.rootId },
              });
            }

            return navigation.navigate(TAB_NAVIGATOR_MY_ITEMS, {
              screen: MY_ITEMS_NAVIGATOR_MY_ITEMS,
            });
          }}
        ></Button>
      ),
    });
  }, [navigation]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError || !children) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['left']}>
      <PlayerView children={children} origin={origin} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

export default PlayerFolderScreen;
