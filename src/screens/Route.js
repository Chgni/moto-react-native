import React, { useState, useEffect } from 'react';
import {View, StyleSheet, Image, TextInput, TouchableOpacity, Text} from 'react-native';
import StepsComponent from '../components/StepsComponent';
import { Button, Dialog, Icon, Input, Snackbar } from '@rneui/themed';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import RouteService, { createTrip, getTripById, updateTrip } from '../services/RouteService';
import { useUser } from '../guards/WithAuthGuard';
import { useIsFocused } from '@react-navigation/native';
import FriendsService from '../services/FriendsService';
import SearchFriendTrip from '../components/SeachFriendTrip';
import axios from 'axios';

const RouteScreen = ({ route, navigation }) => {
    const routeService = new RouteService()
    const friendsService = new FriendsService()
    const { user, token } = useUser();
    const isFocused = useIsFocused();
    const [visible, setVisible] = useState(false);
    const [navigationRoute, setNavigationRoute] = useState({});
    const [ableToUpdate, setAbleToUpdate] = useState(false);
    const [friends, setFriends] = useState([]);
    const [waypoints, setWaypoints] = useState([])
    const loadRoute = async (routeId) => {
        try {
            console.log('getting route')
            const navigationRoute = await routeService.getRouteById(routeId)
            setNavigationRoute(navigationRoute)
            setWaypoints(navigationRoute.waypoints)
            console.log(navigationRoute)
            if (navigationRoute.owner_id === user.id) {
                setAbleToUpdate(true);
            }
        } catch (e) {
            // TODO handle error
        }
    }
    const loadFriendsOfCurrentUser = () => {
        friendsService.getFriends().then(
            (response) => {
                setFriends(response);
            }).catch(error => {
                // TODO Error handling
            }
        )
    }
    useEffect(() => {
        console.log("user")
        console.log()
        if (isFocused && user && token && route.params) {
            const { tripId } = route.params;
            const { created } = route.params;
            if (created) {
                // setVisible(true);
            }
            loadRoute(tripId)
            loadFriendsOfCurrentUser()
            // getTrip(tripId);
            // getFriendsForCurrentUser();
        }
    }, [isFocused, user, token]);
    return(
        <View>

            <Text>Yiooo</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#fff',
    },
    mapStyle: {
        flex: 1,
    },
    itineraryInfosItem: {
        marginTop: 10,
        padding: 10,
    },
    itineraryInfosTextArea: {
        backgroundColor: 'lightgray',
        width: '100%',
        borderRadius: 15,
        height: 150,
        padding: 10,
    },
    saveTripButton: {
        position: 'absolute',
        right: 10,
        bottom: 20,
        borderRadius: 50,
    },
    customMarker: {
        position: 'absolute',
        top: 0,
        left: 8,
        backgroundColor: 'red',
        padding: 2,
        width: 18,
        borderRadius: 20,
    },
    markerText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default RouteScreen;