import React from 'react';
import {forwardRef, ReactElement, ForwardedRef, useState} from 'react';
import {useWindowDimensions, StyleSheet} from 'react-native';
import {Camera as CameraBase, CameraProps} from 'react-native-vision-camera';

function RefForwardingCamera(
  props: CameraProps,
  ref: ForwardedRef<CameraBase>,
): ReactElement | null {
  const dimensions = useWindowDimensions();

  const [stretchFix, setStretchFix] = useState<number>(0);
  return (
    <CameraBase
      ref={ref}
      {...props}
      style={
        stretchFix
          ? {
              width: dimensions.width,
              height: dimensions.height - 1,
            }
          : StyleSheet.absoluteFill
      }
      onInitialized={() => setStretchFix(1)}
      outputOrientation="preview"
    />
  );
}

export const Camera = forwardRef(RefForwardingCamera);
