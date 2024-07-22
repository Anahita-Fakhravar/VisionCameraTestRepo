import * as React from 'react';
//third parties
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//screens
import {AddPictureScreen} from '../add-pictures';
import {Camera} from '../camera';

type RootStackParamList = {
  Camera: undefined;
  AddPictureScreen: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{animation: 'slide_from_right'}}>
        <RootStack.Screen
          name="AddPictureScreen"
          component={AddPictureScreen}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="Camera"
          component={Camera}
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
