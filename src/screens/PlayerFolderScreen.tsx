import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MaterialIcons } from '@expo/vector-icons';

import { useNavigation, useRoute } from '@react-navigation/native';

import ActivityIndicator from '../components/ActivityIndicator';
import PlayerView from '../components/PlayerView';
import { PLAYER_COLOR } from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import { ItemScreenProps } from '../navigation/types';
import { useFocusQuery } from '../utils/functions/useQuery';

const PlayerFolderScreen = (): JSX.Element | null => {
  const route = useRoute<ItemScreenProps<'ItemStackItem'>['route']>();
  const { itemId } = route.params;
  const { hooks } = useQueryClient();
  const {
    data: children,
    isLoading,
    isError,
    refetch,
  } = hooks.useChildren(itemId);
  useFocusQuery(refetch);
  const navigation =
    useNavigation<ItemScreenProps<'ItemStackItem'>['navigation']>();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: PLAYER_COLOR,
      },
      headerRight: () => (
        <Button
          buttonStyle={{ backgroundColor: PLAYER_COLOR }}
          icon={
            <MaterialIcons
              name={'close'}
              color="#fff"
              size={25}
              style={{ paddingRight: 3, backgroundColor: PLAYER_COLOR }}
            />
          }
          onPress={() => {
            if (itemId) {
              navigation.navigate('ItemStack', {
                screen: 'ItemStackItem',
                params: { itemId },
              });
            } else {
              navigation.navigate('MyItemsTab', { screen: 'MyItemsStack' });
            }
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
      <PlayerView children={children} />
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
