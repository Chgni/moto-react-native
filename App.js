
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import HomeScreen from "./screens/Home";

const Stack = createStackNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
        </Tab.Navigator>
    );
};

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Connexion" component={LoginScreen} />
          <Stack.Screen name="Inscription" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}