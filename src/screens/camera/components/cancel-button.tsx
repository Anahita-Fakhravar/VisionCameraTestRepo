import React from 'react';
import {FunctionComponent, useState} from 'react';
import {Pressable, PressableProps, Text} from 'react-native';
import styled from 'styled-components';

export interface Props {
  onPress: PressableProps['onPress'];
  disabled?: boolean;
}

export const CancelButton: FunctionComponent<Props> = ({onPress, disabled}) => {
  const [pressed, setPressed] = useState(false);

  const onPressIn = () => {
    setPressed(true);
  };

  const onPressOut = () => {
    setPressed(false);
  };

  return (
    <Button
      disabled={disabled}
      accessible
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}>
      <Label pressed={pressed}>Cancel</Label>
    </Button>
  );
};

const Button = styled(Pressable)`
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  position: absolute;
  z-index: 1000;
  bottom: 35px;
  left: 20px;
`;

const Label = styled(Text)<{pressed: boolean}>`
  color: white;
  font-size: 17px;
  letter-spacing: 0.16px;
  line-height: 19px;
  opacity: ${({pressed}) => (pressed ? '0.5' : '1')};
  padding: 10px;
`;
