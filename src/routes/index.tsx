import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';

import { useAuth } from '../hooks/auth';

import SplashScreen from 'react-native-splash-screen'

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  if (!loading) {
    SplashScreen.hide();
  }

  return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
