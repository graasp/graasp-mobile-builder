import React, { FC, useMemo } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface CustomBackdropProps {
  animatedIndex: any;
  style: any;
  onBackDropPressed: () => any;
}

const CustomBackdrop: FC<CustomBackdropProps> = ({
  animatedIndex,
  style,
  onBackDropPressed = () => null,
}) => {
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [0, 0.65],
      Extrapolate.CLAMP,
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: '#000',
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle],
  );

  return (
    <TouchableWithoutFeedback onPress={() => onBackDropPressed()}>
      <Animated.View style={containerStyle} />
    </TouchableWithoutFeedback>
  );
};

export default CustomBackdrop;
