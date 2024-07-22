import React from 'react';
import {FunctionComponent, useState, useRef, useEffect} from 'react';
import {
  Platform,
  Pressable,
  PressableProps,
  Animated,
  View,
  Text,
} from 'react-native';
import styled from 'styled-components/native';
import {SPRING_STIFF_CONFIG} from '../constance/constance';

interface Props {
  onPress: PressableProps['onPress'];
  state: 'back' | 'front';
  disabled: boolean;
}

export const FlipCameraButton: FunctionComponent<Props> = ({
  onPress,
  state,
  disabled,
}) => {
  const rotate = useRef(new Animated.Value(0)).current;
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      if (state === 'back') {
        Animated.spring(rotate, {
          ...SPRING_STIFF_CONFIG,
          toValue: 0,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(rotate, {
          ...SPRING_STIFF_CONFIG,
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [state, rotate]);

  const onPressIn = () => {
    if (!disabled) {
      setPressed(true);
    }
  };

  const onPressOut = () => {
    if (!disabled) {
      setPressed(false);
    }
  };

  return (
    <Button
      accessible
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={!disabled ? onPress : undefined}
      disabled={disabled}>
      <Container pressed={pressed}>
        <Text>Flip</Text>
      </Container>
    </Button>
  );
};

const Button = styled(Pressable)<{
  disabled: boolean;
}>`
  opacity: ${({disabled}) => (disabled ? '0.4' : '1')};
  position: absolute;
  z-index: 10000;
  align-self: center;
  bottom: 120px;
`;

const Container = styled(View)<{
  pressed: boolean;
}>`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  height: 40px;
  justify-content: center;
  opacity: ${({pressed}) => (pressed ? '0.5' : '1')};
  width: 40px;
`;
