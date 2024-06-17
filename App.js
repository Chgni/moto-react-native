import { View, StyleSheet } from 'react-native';

import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Text, BottomNavigation, PaperProvider, Badge} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useContext, useEffect} from 'react';
import {NavigationContainer, useNavigation, useRoute} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/screens/Login';
import LogoutScreen from './src/screens/Logout';
import RegisterScreen from './src/screens/Register';
import HomeScreen from "./src/screens/Home";
import FriendsScreen from "./src/screens/Friends";

import { Ionicons } from '@expo/vector-icons';
import withAuthGuard from "./src/guards/WithAuthGuard";
import logout from "./src/screens/Logout";
import BASE_URL from './src/services/Api'
import {ActivityIndicator, SafeAreaView} from "react-native";
import StorageService from "./src/services/storageService";
import AuthService from "./src/services/AuthService";
import RouteScreen from "./src/screens/Route";
import {FriendRequestProvider, FriendRequestReceivedContext} from "./src/contexts/FriendRequestReceivedContext";
import webSocketService from "./src/services/WebSocketService";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ProtectedLogin = withAuthGuard(LoginScreen);
const ProtectedHome = withAuthGuard(HomeScreen);
const ProtectedFriends = withAuthGuard(FriendsScreen);

const ProtectedRoute = withAuthGuard(RouteScreen)
const MainTabs = () => {


    const { friendRequests } = useContext(FriendRequestReceivedContext);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
            tabBar={({ navigation, state, descriptors, insets }) => (
                <BottomNavigation.Bar
                    navigationState={state}
                    safeAreaInsets={insets}
                    onTabPress={({ route, preventDefault }) => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (event.defaultPrevented) {
                            preventDefault();
                        } else {
                            navigation.dispatch({
                                ...CommonActions.navigate(route.name, route.params),
                                target: state.key,
                            });
                        }
                    }}
                    renderIcon={({ route, focused, color }) => {
                        const { options } = descriptors[route.key];
                        if (options.tabBarIcon) {
                            return options.tabBarIcon({ focused, color, size: 24 });
                        }

                        return null;
                    }}
                    getLabelText={({ route }) => {
                        const { options } = descriptors[route.key];
                        const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                    ? options.title
                                    : route.title;

                        return label;
                    }}
                />
            )}
        >
            <Tab.Screen name="Home" component={ProtectedHome} options={{
                title: 'Accueil', headerShown: false,
                tabBarLabel: 'Accueil',
                tabBarIcon: ({ color, size }) => (
                    <Icon name="home" size={size} color={color} />
                ),
            }}/>
            <Tab.Screen name="Friends" component={ProtectedFriends} options={{ title: 'Amis', headerShown: false,
                tabBarLabel: 'Amis',
                tabBarIcon: ({ color, size }) => {
                    return <View>
                        <Text>
                            <Icon name="account-group" size={size} color={color} />
                        </Text>
                        {friendRequests > 0 && <Badge style={{position: "absolute", top: -5, right: -12.5}}>{friendRequests}</Badge>}
                    </View>
                },
            }} />
        </Tab.Navigator>
    );
};

export default function App() {
    return (
        <FriendRequestProvider>
            <PaperProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Connexion">
                        <Stack.Screen name="Connexion" component={ProtectedLogin} />
                        <Stack.Screen name="Deconnexion" component={LogoutScreen} />
                        <Stack.Screen name="Inscription" component={RegisterScreen} />
                        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                        <Stack.Screen name="Route" component={ProtectedRoute} options={{ headerShown: false }} />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </FriendRequestProvider>


      );
}
