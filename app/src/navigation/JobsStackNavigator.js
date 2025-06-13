import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import JobDetailsScreen from '../screens/JobDetailsScreen';
import JobsScreen from '../screens/JobsScreen';

const Stack = createStackNavigator();

export default function JobsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="JobsList" component={JobsScreen} options={{ title: 'Jobs' }} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} options={{ title: 'Job Details' }} />
    </Stack.Navigator>
  );
}
