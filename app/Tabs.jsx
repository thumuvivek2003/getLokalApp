import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Button, Text, View } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// --- Jobs Screens ---
function JobsScreen({ navigation }) {
  return (
    <View>
      <Text>Jobs List</Text>
      <Button title="Go to Job Details" onPress={() => navigation.navigate('JobDetails')} />
    </View>
  );
}

function JobDetailsScreen() {
  return (
    <View>
      <Text>Job Details</Text>
    </View>
  );
}

// --- Bookmarks Screens ---
function BookmarksScreen({ navigation }) {
  return (
    <View>
      <Text>Bookmarks List</Text>
      <Button title="Go to Job Details" onPress={() => navigation.navigate('JobDetails')} />
    </View>
  );
}

// --- Stacks ---
function JobsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="JobsList" component={JobsScreen} options={{ title: 'Jobs' }} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} options={{ title: 'Job Details' }} />
    </Stack.Navigator>
  );
}

function BookmarksStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BookmarksList" component={BookmarksScreen} options={{ title: 'Bookmarks' }} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} options={{ title: 'Job Details' }} />
    </Stack.Navigator>
  );
}

// --- Tabs ---
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = route.name === 'Jobs'
            ? (focused ? 'briefcase' : 'briefcase-outline')
            : (focused ? 'bookmark' : 'bookmark-outline');
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Jobs" component={JobsStack} />
      <Tab.Screen name="Bookmarks" component={BookmarksStack} />
    </Tab.Navigator>
  );
}
