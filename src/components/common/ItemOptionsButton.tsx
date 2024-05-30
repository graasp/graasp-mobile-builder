import { useRef } from 'react';
import { Pressable, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';

import { DiscriminatedItem } from '@graasp/sdk';

import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { BOTTOM_SNAP_POINTS_ITEM_LIST } from '../../config/constants/constants';
import { useFocusQuery } from '../../utils/functions/useQuery';
import ItemListOptions from '../ItemListOptions';
import CustomBackdrop from './CustomBackdrop';

export type ItemOptionsButtonProps = {
  item: DiscriminatedItem;
  refresh: () => void;
  color: string;
  testId?: string;
};

const ItemOptionsButton = ({
  item,
  refresh,
  color,
  testId,
}: ItemOptionsButtonProps) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  /* Disable or enable the bottom sheet animateOnMount property depending on the reduced motion setting of the device. 
  It solves the bug introduced in react-native-reanimated with SDK 50 and it should be fixed in @gorhom/bottom-sheet v5 */
  const reducedMotion = useReducedMotion();

  useFocusQuery(refresh);

  const openOptions = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <>
      <Pressable
        testID={testId}
        onPress={() => openOptions()}
        style={{ paddingHorizontal: 2 }}
      >
        <Icon type="material" name="more-vert" size={24} color={color} />
      </Pressable>
      <BottomSheetModal
        animateOnMount={!reducedMotion}
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={BOTTOM_SNAP_POINTS_ITEM_LIST}
        backdropComponent={({ animatedIndex, style: backDropStyle }) => (
          <CustomBackdrop
            animatedIndex={animatedIndex}
            style={backDropStyle}
            onBackDropPressed={() => bottomSheetModalRef.current?.close()}
          />
        )}
      >
        <NativeViewGestureHandler disallowInterruption={true}>
          <View style={{ flex: 1 }}>
            <ItemListOptions
              itemSelected={item}
              bottomSheetModalRef={bottomSheetModalRef}
              refresh={refresh}
            />
          </View>
        </NativeViewGestureHandler>
      </BottomSheetModal>
    </>
  );
};

export default ItemOptionsButton;
