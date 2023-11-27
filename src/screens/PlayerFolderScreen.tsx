import { FC, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MaterialIcons } from '@expo/vector-icons';

import { CompositeScreenProps, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import ActivityIndicator from '../components/ActivityIndicator';
import PlayerView from '../components/PlayerView';
import { PLAYER_COLOR } from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import { CommonStackParamList } from '../navigation/CommonStackNavigator';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useFocusQuery } from '../utils/functions/useQuery';

type CommonStackPlayerFolderProps = CompositeScreenProps<
  StackScreenProps<
    CommonStackParamList,
    'CommonStackPlayerFolder',
    'CommonStackNavigator'
  >,
  StackScreenProps<RootStackParamList>
>;
type PlayerFolderScreenRouteProp = CommonStackPlayerFolderProps['route'];

const PlayerFolderScreen: FC<any> = ({ navigation }) => {
  const route = useRoute<PlayerFolderScreenRouteProp>();
  const { itemId, builderItemId } = route.params;
  const { hooks } = useQueryClient();
  const {
    data: children,
    isLoading,
    isError,
    refetch,
  } = hooks.useChildren(itemId);
  useFocusQuery(refetch);

  useEffect(() => {
    navigation.setOptions({
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
            if (builderItemId) {
              navigation.navigate('CommonStack', {
                screen: 'CommonStackFolder',
                params: { itemId: builderItemId },
              });
            } else {
              navigation.navigate('MyItemsStack');
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
