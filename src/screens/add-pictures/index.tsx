import React, {useCallback, useState} from 'react';
import {Pressable, View, Text, Platform} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {PERMISSIONS, request} from 'react-native-permissions';
import {Camera as CameraComponent} from './../camera';
import styled from 'styled-components';
import {Picture} from './components/picture';
import {PictureAsset} from '../camera/typings/types';

export const AddPictureScreen = () => {
  const androidVersion = Platform.OS === 'android' ? Platform.Version : null;
  const [listPictures, setListPictures] = useState<PictureAsset[]>([]);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const openCamera = useCallback(async () => {
    const rnvcPermission = await Camera.requestCameraPermission();
    const cameraPermissionStatus = await request(
      Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        default: PERMISSIONS.ANDROID.CAMERA,
      }),
    );
    const storagePermissionStatus = await request(
      Platform.select({
        default:
          androidVersion && androidVersion >= 29
            ? PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      }),
    );
    if (
      (rnvcPermission === 'granted' || cameraPermissionStatus === 'granted') &&
      storagePermissionStatus === 'granted'
    ) {
      setShowCamera(true);
    } else if (
      storagePermissionStatus &&
      storagePermissionStatus !== 'granted'
    ) {
      console.log('Permission denied');
    } else if (cameraPermissionStatus && cameraPermissionStatus !== 'granted') {
      console.log('Show error: Camera permission denied');
    }
  }, [androidVersion]);

  const onCloseCamera = useCallback(() => {
    setShowCamera(false);
  }, [setShowCamera]);

  return (
    <View>
      <CameraButton onPress={openCamera}>
        <CameraButtonTxt>Open Camera</CameraButtonTxt>
      </CameraButton>
      <CameraComponent
        visible={showCamera}
        onCloseCamera={onCloseCamera}
        setListPictures={setListPictures}
      />

      {listPictures?.map(picture => (
        <Picture picture={picture} />
      ))}
    </View>
  );
};

const CameraButton = styled(Pressable)`
  background-color: blue;
  padding: 10px;
  margin-top: 20px;
  align-self: center;
  border-radius: 4px;
`;
const CameraButtonTxt = styled(Text)`
  color: white;
`;
