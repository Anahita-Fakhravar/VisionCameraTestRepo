import React, {FunctionComponent} from 'react';
import {View, Image} from 'react-native';
import styled from 'styled-components/native';
import {PictureAsset} from '../../camera/typings/types';

interface Props {
  picture: PictureAsset;
}

export const Picture: FunctionComponent<Props> = ({picture}) => {
  return (
    <StyledCard>
      <StyledImage
        source={{
          uri: picture.path!,
        }}
        resizeMode="cover"
      />
    </StyledCard>
  );
};

const StyledCard = styled(View)`
  margin-bottom: 16px;
  padding-bottom: 8px;
  background-color: pink;
  margin-top: 8px;
`;

const StyledImage = styled(Image)`
  height: 80px;
  width: 80px;
  align-self: center;
  margin-top: 8px;
`;
