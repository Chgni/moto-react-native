
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/Login';
import LogoutScreen from './screens/Logout';
import RegisterScreen from './screens/Register';
import HomeScreen from "./screens/Home";
import FriendsScreen from "./screens/Friends";
import CreateTripScreen from "./screens/CreateTrip";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import { Ionicons } from '@expo/vector-icons';
import withAuthGuard from "./Guard/WithAuthGuard";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ProtectedLogin = withAuthGuard(LoginScreen);
const ProtectedHome = withAuthGuard(HomeScreen);
const ProtectedFriends = withAuthGuard(FriendsScreen);
const ProtectedCreateTrip = withAuthGuard(CreateTripScreen);


const MainTabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={ProtectedHome} options={{
                title: 'Accueil', headerShown: false,
                tabBarLabel: 'Accueil',
                tabBarIcon: () => (
                    <Ionicons name="home" size={20}/>
                ),
            }}/>
            <Tab.Screen name="CreateTrip" component={ProtectedCreateTrip} options={{ title: 'Créer', headerShown: false,
                tabBarLabel: 'Créer',
                tabBarIcon: () => (
                    <Ionicons name="home" size={20}/>
                ),
            }} />
            <Tab.Screen name="Friends" component={ProtectedFriends} options={{ title: 'Amis', headerShown: false,
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
        <Stack.Navigator initialRouteName="Connexion">
          <Stack.Screen name="Connexion" component={ProtectedLogin} />
          <Stack.Screen name="Deconnexion" component={LogoutScreen} />
          <Stack.Screen name="Inscription" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}