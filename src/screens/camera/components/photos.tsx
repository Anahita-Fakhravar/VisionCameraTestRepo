import React from 'react';
import {FunctionComponent, useEffect, useRef} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {Photo} from './photo';
import {PhotoFile} from 'react-native-vision-camera';

interface PhotoType extends PhotoFile {}
interface Props {
  photos: PhotoType[];
  onPhotoPress: (photo: PhotoType) => void;
}

export const Photos: FunctionComponent<Props> = ({photos, onPhotoPress}) => {
  const scrollView = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollView.current) {
      scrollView.current.scrollToEnd();
    }
  }, [photos.length]);

  return photos.length ? (
    <Container
      horizontal
      contentContainerStyle={styles.contentContainerStyle}
      ref={scrollView}>
      {photos.map((photo, index) => (
        <Photo
          key={photo.path}
          photo={photo}
          first={index === 0}
          onPress={() => onPhotoPress(photo)}
        />
      ))}
    </Container>
  ) : null;
};

const Container = styled(ScrollView)`
  height: 82px;
  left: 0%;
  bottom: 120px;
  position: absolute;
  z-index: 1000;
  right: 0;
`;

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingLeft: 16,
    paddingRight: 16,
  },
});
