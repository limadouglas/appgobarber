import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CreateAppointments from '../pages/CreateAppointments';
import AppointmentsCreated from '../pages/AppointmentsCreated';

import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

const App = createStackNavigator();

const AppRoutes: React.FC = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#312e38' },
    }}
  >
    <App.Screen name="Dashboard" component={Dashboard} />
    <App.Screen name="CreateAppointments" component={CreateAppointments} />
    <App.Screen name="AppointmentCreated" component={AppointmentsCreated} />

    <App.Screen name="Profile" component={Profile} />
  </App.Navigator>
);

export default AppRoutes;
