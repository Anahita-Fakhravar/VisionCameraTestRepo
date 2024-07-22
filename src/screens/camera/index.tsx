import React, {useCallback, useState} from 'react';
import {Platform, Modal} from 'react-native';
import styled from 'styled-components/native';
import {CameraScreen} from './components/camera-screen';
import {PhotoFile} from 'react-native-vision-camera';
import {PERMISSIONS, request} from 'react-native-permissions';
import {
  copyFile,
  DocumentDirectoryPath,
  exists,
  getFSInfo,
  PicturesDirectoryPath,
  unlink,
} from 'react-native-fs';

import ImageResizer from '@bam.tech/react-native-image-resizer';
import {PictureAsset} from './typings/types';

interface Photo extends PhotoFile {}
export interface CameraProps {
  visible: boolean;
  loading?: boolean;
  onRequestClose: () => void;
  onComplete: (photos: Photo[]) => void;
  onError: (err: Error) => void;
}

export const Camera = ({
  visible,
  onCloseCamera,
  setListPictures,
}: {
  visible: boolean;
  onCloseCamera: () => void;
  setListPictures: (pictures: PictureAsset[]) => void;
}) => {
  const androidVersion = Platform.OS === 'android' ? Platform.Version : null;
  const [photos, setPhotos] = useState<Photo[]>([]);

  const handleAddPhoto = useCallback((photo: Photo) => {
    setPhotos(s => [...s, photo]);
  }, []);

  const handleRemovePhoto = useCallback((photo: Photo) => {
    setPhotos(s => s.filter(a => a.path !== photo.path));
  }, []);

  const handleCancelPress = useCallback(() => {
    onCloseCamera();
    setPhotos([]);
  }, [onCloseCamera]);

  const savePictureToDevice = async (
    tempImagePath: string,
    localDirectory: string,
    deleteImageProvided: boolean,
  ): Promise<string | void> => {
    await request(
      Platform.select({
        default: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      }),
    );
    // eslint-disable-next-line no-useless-escape
    const imageFileName = tempImagePath.replace(/^.*[\\\/]/, '');
    const imageToStorePath = `${localDirectory}/${imageFileName}`;
    const tempImageExists = await exists(tempImagePath);
    if (tempImageExists) {
      const resizeResponse = await ImageResizer.createResizedImage(
        tempImagePath,
        1920,
        1920,
        'JPEG',
        42,
        0,
      );
      await copyFile('file:///' + resizeResponse.path, imageToStorePath);
      await unlink('file:///' + resizeResponse.path);
      if (deleteImageProvided) {
        await unlink(tempImagePath);
      }
      return 'file:///' + imageToStorePath;
    } else {
      throw new Error('Image does not exist.');
    }
  };

  const savePicturesToDeviceStorage = useCallback(
    async (
      picturesToSave: PictureAsset[],
      deleteImagesProvided: boolean,
    ): Promise<PictureAsset[]> => {
      const info = await getFSInfo();
      if (info?.freeSpace && info.freeSpace / 1024 <= 50000) {
        console.log('show error: device is almost full');
      }
      const localAndroidDir = `${PicturesDirectoryPath}`;
      const localIosDir = `${DocumentDirectoryPath}`;
      const offlineSavedPictures: PictureAsset[] = [];
      const permissionStatus = await request(
        Platform.select({
          default:
            androidVersion && androidVersion >= 29
              ? PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION
              : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        }),
      );
      const imageStorageDirectory =
        Platform.OS === 'android' ? localAndroidDir : localIosDir;
      if (permissionStatus && permissionStatus === 'granted') {
        for (const tempImage of picturesToSave) {
          const imageOfflinePath: string | void = await savePictureToDevice(
            tempImage.path,
            imageStorageDirectory,
            deleteImagesProvided,
          );
          if (imageOfflinePath) {
            offlineSavedPictures.push({
              ...tempImage,
              path: imageOfflinePath,
            });
          } else {
            offlineSavedPictures.push({
              ...tempImage,
            });
          }
        }
      } else {
        console.log('show error: Files and media permission denied');
      }
      return offlineSavedPictures;
    },
    [androidVersion],
  );

  const addCameraPhotos = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    async (photos: Photo[]) => {
      if (photos?.length) {
        try {
          const offlinePictures: PictureAsset[] =
            await savePicturesToDeviceStorage(photos, true);
          setListPictures(offlinePictures);
        } catch (error) {
          console.log('show error: error in addCameraPhotos', error);
        }
      }
    },
    [savePicturesToDeviceStorage, setListPictures],
  );

  const handleDonePress = useCallback(() => {
    addCameraPhotos(photos);
    setPhotos([]);
    onCloseCamera();
  }, [addCameraPhotos, onCloseCamera, photos]);

  return (
    <ContentContainer
      visible={visible}
      supportedOrientations={[
        'portrait',
        'landscape',
        'landscape-left',
        'landscape-right',
      ]}
      animationType="slide">
      <CameraScreen
        photos={photos}
        onAddPhoto={handleAddPhoto}
        onRemovePhoto={handleRemovePhoto}
        onCancelPress={handleCancelPress}
        onDonePress={handleDonePress}
      />
    </ContentContainer>
  );
};

const ContentContainer = styled(Modal)`
  background-color: black;
  flex: 1;
`;
