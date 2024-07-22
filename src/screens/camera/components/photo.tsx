import React from 'react';
import {FunctionComponent, useRef} from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  View,
  Image,
  Text,
} from 'react-native';
import styled from 'styled-components/native';
import {trigger} from 'react-native-haptic-feedback';
import {PhotoFile} from 'react-native-vision-camera';
import {SPRING_STIFF_CONFIG} from '../constance/constance';

interface PhotoType extends PhotoFile {}
interface Props {
  photo: PhotoType;
  first: boolean;
  onPress: PressableProps['onPress'];
}

export const Photo: FunctionComponent<Props> = ({photo, first, onPress}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    Animated.spring(scale, {
      ...SPRING_STIFF_CONFIG,
      toValue: 0.88,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      ...SPRING_STIFF_CONFIG,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      accessible
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}>
      <Container
        first={first}
        style={{
          transform: [{scale}],
        }}>
        <PhotoImage
          accessibilityIgnoresInvertColors
          source={{uri: photo.path}}
        />
        <DeleteBadge>
          <CloseText>X</CloseText>
        </DeleteBadge>
      </Container>
    </Pressable>
  );
};

const Container = styled(Animated.View)<{first: boolean}>`
  align-items: flex-end;
  flex-direction: row;
  height: 82px;
  margin-left: ${({first}) => (!first ? '16px' : '0px')};
  width: 82px;
`;

const PhotoImage = styled(Image)`
  border-color: #e1e3e6;
  border-radius: 3px;
  border-width: 0.75px;
  height: 75px;
  width: 75px;
`;

const DeleteBadge = styled(View)`
  align-items: center;
  background: white;
  border-color: #e1e3e6;
  border-radius: 0.5px;
  border-radius: 11px;
  height: 22px;
  justify-content: center;
  position: absolute;
  right: 0px;
  top: 0px;
  width: 22px;
`;
const CloseText = styled(Text)`
  color: black;
`;
