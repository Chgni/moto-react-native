
import React, {useEffect} from 'react';
import {NavigationContainer, useNavigation, useRoute} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/screens/Login';
import LogoutScreen from './src/screens/Logout';
import RegisterScreen from './src/screens/Register';
import HomeScreen from "./src/screens/Home";
import FriendsScreen from "./src/screens/Friends";
import CreateTripScreen from "./src/screens/CreateTrip";
import UpdateTripScreen from "./src/screens/UpdateTrip";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import { Ionicons } from '@expo/vector-icons';
import withAuthGuard from "./src/guards/WithAuthGuard";
import logout from "./src/screens/Logout";
import BASE_URL from './src/services/Api'
import {ActivityIndicator, SafeAreaView} from "react-native";
import StorageService from "./src/services/storageService";
import AuthService from "./src/services/AuthService";
import RouteScreen from "./src/screens/Route";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ProtectedLogin = withAuthGuard(LoginScreen);
const ProtectedHome = withAuthGuard(HomeScreen);
const ProtectedFriends = withAuthGuard(FriendsScreen);
const ProtectedCreateTrip = withAuthGuard(CreateTripScreen);
const ProtectedUpdateTrip = withAuthGuard(UpdateTripScreen);
const ProtectedRoute = withAuthGuard(RouteScreen)
const MainTabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={ProtectedHome} options={{
                title: 'Accueil', headerShown: false,
                tabBarLabel: 'Accueil',
                tabBarIcon: () => (
                    <Ionicons name="home" size={30}/>
                ),
            }}/>
            <Tab.Screen name="Friends" component={ProtectedFriends} options={{ title: 'Amis', headerShown: false,
                tabBarLabel: 'Amis',
                tabBarIcon: () => (
                    <Ionicons name="people-circle-outline" size={30}/>
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
                <Stack.Screen name="CreateTrip" component={ProtectedCreateTrip} options={{ headerShown: false }} />
                <Stack.Screen name="UpdateTrip" component={ProtectedUpdateTrip} options={{ headerShown: false }} />
                <Stack.Screen name="Route" component={ProtectedRoute} options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
      );
}