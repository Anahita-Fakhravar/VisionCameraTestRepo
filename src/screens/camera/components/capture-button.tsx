import React from 'react';
import {FunctionComponent, useRef} from 'react';
import {Pressable, View, Animated, PressableProps} from 'react-native';
import styled from 'styled-components/native';
import {trigger} from 'react-native-haptic-feedback';
import {SPRING_STIFF_CONFIG} from '../constance/constance';

export interface PhotoButtonProps {
  onPress: PressableProps['onPress'];
  disabled?: boolean;
}

export const CaptureButton: FunctionComponent<PhotoButtonProps> = ({
  onPress,
  disabled,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      ...SPRING_STIFF_CONFIG,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Button
      accessible
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={!!disabled}>
      <Background>
        <Border>
          <Circle
            style={{
              transform: [{scale}],
            }}
          />
        </Border>
      </Background>
    </Button>
  );
};

const Button = styled(Pressable)<{
  disabled: boolean;
}>`
  opacity: ${({disabled}) => (disabled ? '0.4' : '1')};
  position: absolute;
  z-index: 1000;
  bottom: 20px;
  align-self: center;
`;

const Background = styled(View)`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 37px;
  height: 74px;
  justify-content: center;
  width: 74px;
`;

const Border = styled(View)`
  align-items: center;
  border-color: white;
  border-radius: 33px;
  border-width: 6px;
  height: 66px;
  justify-content: center;
  width: 66px;
`;

const Circle = styled(Animated.View)`
  background: white;
  border-radius: 25px;
  height: 50px;
  width: 50px;
`;
