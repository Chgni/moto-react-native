
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import HomeScreen from "./screens/Home";
import FriendsScreen from "./screens/Friends";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} options={{
                title: 'Accueil', headerShown: false,
                tabBarLabel: 'Accueil',
                tabBarIcon: () => (
                    <Ionicons name="home" size={20}/>
                ),
            }}/>
            <Tab.Screen name="Friends" component={FriendsScreen} options={{ title: 'Amis', headerShown: false,
                tabBarLabel: 'Amis',
                tabBarIcon: () => (
                    <Ionicons name="home" size={20}/>
                ),
            }} />
        </Tab.Navigator>
    );
};

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Connexion" component={LoginScreen} />
          <Stack.Screen name="Inscription" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}