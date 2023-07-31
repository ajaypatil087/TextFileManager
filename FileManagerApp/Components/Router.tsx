import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FileList from './FileList';
import Editor from './Editor';
import Title from './common/Title';
import MusicPlayer from './Music/Music';

const Stack = createNativeStackNavigator();

const Router = (): JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Files"
          component={FileList}
          options={{
            headerRight(props) {
              return <Title label="File" icon="filetext1" />;
            },
            title: '',
          }}
        />
        <Stack.Screen
          name="Editor"
          component={Editor}
          options={{
            headerRight(props) {
              return <Title label="Editor" icon="edit" />;
            },
            title: '',
          }}
        />
        <Stack.Screen
          name="Music"
          component={MusicPlayer}
          options={{
            headerRight(props) {
              return <Title label="Music" icon="playcircleo" />;
            },
            title: '',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
