import React from 'react';
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {SafeAreaView, BackHandler, ActivityIndicator} from 'react-native';
import {
  CameraDevice,
  Camera as CameraRef,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import {Camera} from './camera';
import {Photos} from './photos';
import {PhotoFile} from 'react-native-vision-camera';
import styled from 'styled-components/native';
import {CancelButton} from './cancel-button';
import {DoneButton} from './done-button';
import {CaptureButton} from './capture-button';
import {FlipCameraButton} from './flip-camera-button';

interface Photo extends PhotoFile {}
export interface CameraProps {
  photos: Photo[];
  onAddPhoto: (photo: Photo) => void;
  onRemovePhoto: (photo: Photo) => void;
  onCancelPress: () => void;
  onDonePress: () => void;
  loading?: boolean;
}

interface CameraState {
  flashMode: 'auto' | 'on' | 'off';
  torchMode: 'off' | 'on';
  cameraType: 'front' | 'back';
}

export const CameraScreen: FunctionComponent<CameraProps> = ({
  photos,
  onAddPhoto,
  onRemovePhoto,
  onCancelPress,
  onDonePress,
}) => {
  const [state, setState] = useState<CameraState>({
    flashMode: 'auto',
    torchMode: 'off',
    cameraType: 'back',
  });
  const camera = useRef<CameraRef>(null);
  const [isPhotoProcessing, setIsPhotoProcessing] = useState(false);
  const prevCameraType = useRef(state.cameraType);
  const device = useCameraDevice(state.cameraType);
  const format = useCameraFormat(device, [
    {photoResolution: {width: 1920, height: 1920}, photoHdr: false},
  ]);
  useEffect(() => {
    if (state.cameraType !== prevCameraType.current) {
      prevCameraType.current = state.cameraType;
    }
  }, [state.cameraType]);

  const handleCapturePress = useCallback(async () => {
    if (camera.current) {
      try {
        setIsPhotoProcessing(true);
        const photo = await camera?.current?.takePhoto();
        onAddPhoto({...photo, path: `file://${photo.path}`});

        setIsPhotoProcessing(false);
      } catch (err) {
        setIsPhotoProcessing(false);
        const error = err as Error;
        const errorMessage = error?.message.replace(/\[.*\]\s/, '');
        if (
          errorMessage !== 'CameraDevice was already closed' &&
          errorMessage !== 'Image is already closed' &&
          errorMessage !==
            'The image capture was aborted because it timed out.' &&
          errorMessage !== "Cannot read property 'path' of undefined"
        ) {
          console.log('show error', err);
        }
      }
    }
  }, [onAddPhoto]);

  const handleFlipCameraPress = useCallback(() => {
    setState(s => ({
      ...s,
      cameraType: s.cameraType === 'back' ? 'front' : 'back',
    }));
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (isPhotoProcessing) {
        return true; // This will prevent the app from going back
      }
      return false; // This will allow the app to go back
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      backHandler.remove();
    };
  }, [isPhotoProcessing]);
  return (
    <StyledSafeAreaView>
      <Camera
        ref={camera}
        isActive
        torch={state.torchMode}
        photo
        photoHdr={false}
        device={device as CameraDevice}
        format={format}
      />
      <Container>
        {isPhotoProcessing ? (
          <SpinnerWrapper>
            <Spinner color="#333333" size={44} />
          </SpinnerWrapper>
        ) : null}
        <Photos photos={photos} onPhotoPress={onRemovePhoto} />
        <CancelButton disabled={false} onPress={onCancelPress} />
        <CaptureButton disabled={false} onPress={handleCapturePress} />
        <DoneButton disabled={false} onPress={onDonePress} />
        <FlipCameraButton
          disabled={false}
          onPress={handleFlipCameraPress}
          state={state.cameraType}
        />
      </Container>
    </StyledSafeAreaView>
  );
};

const StyledSafeAreaView = styled(SafeAreaView)`
  flex: 1;
  background-color: white;
`;

const SpinnerWrapper = styled(SafeAreaView)`
  height: 100%;
  justify-content: center;
  position: absolute;
  width: 100%;
`;

const Container = styled(SafeAreaView)`
  flex: 1;
  z-index: 1000;
`;

const Spinner = styled((props: any) => <ActivityIndicator {...props} />)`
  align-self: 'center';
`;
