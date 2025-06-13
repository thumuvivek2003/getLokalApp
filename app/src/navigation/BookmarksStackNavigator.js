import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BookmarksScreen from '../screens/BookmarksScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';

const Stack = createStackNavigator();

export default function BookmarksStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BookmarksList" component={BookmarksScreen} options={{ title: 'Bookmarks' }} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} options={{ title: 'Job Details' }} />
    </Stack.Navigator>
  );
}
