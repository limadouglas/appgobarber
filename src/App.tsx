import 'react-native-gesture-handler';

import React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import codepush from 'react-native-code-push';

import Routes from './routes';
import AppProvider from './hooks';

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" translucent backgroundColor="#312e38" />
    <AppProvider>
      <View style={{ flex: 1, backgroundColor: '#312e38' }}>
        <Routes />
      </View>
    </AppProvider>
  </NavigationContainer>
);

export default codepush({
  checkFrequency: codepush.CheckFrequency.ON_APP_RESUME,
})(App);
