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
import {Tab, TabView} from "@rneui/base";
import FloatingButton from "../components/common/FloatingButton";

const RouteScreen = ({ route, navigation }) => {
    const routeService = new RouteService()
    const friendsService = new FriendsService()
    const { user, token } = useUser();
    const isFocused = useIsFocused();
    const [visible, setVisible] = useState(false);
    const [navigationRoute, setNavigationRoute] = useState(null);
    const [ableToUpdate, setAbleToUpdate] = useState(false);
    const [friends, setFriends] = useState([]);
    const [waypoints, setWaypoints] = useState([])
    const [visibleDialog, setVisibleDialog] = useState(false); // add friend dialog visible
    const [tabIndex, setTabIndex] = React.useState(0);
    const [editing, setEditing] = useState(false)
    const [pageType, setPageType] = useState("create")

    const loadRoute = async (routeId) => {
        try {
            console.log('getting route')
            const navigationRoute = await routeService.getRouteById(routeId)
            setNavigationRoute(navigationRoute)
            setWaypoints(navigationRoute.waypoints)
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
    const toggleAddFriendDialog = () => {
        setVisibleDialog(!visibleDialog);
    }

    const removeMember = () => {
        // TODO
    }
    const addMember = async (user_to_add) => {
        try {
            console.log(navigationRoute.id)
            await routeService.addMember(navigationRoute.id, user_to_add.id)
            loadRoute(navigationRoute.id)
            toggleAddFriendDialog()

        } catch (error) {
            if( error.response ){
                // TODO error handling
            }
        }
    }

    useEffect(() => {
        if (isFocused && user && token && route.params) {
            const { routeId: routeId } = route.params;
            if(routeId) {
                setPageType('update')
                loadRoute(routeId)
                loadFriendsOfCurrentUser()
            }

            // getTrip(tripId);
            // getFriendsForCurrentUser();
        }
    }, [isFocused, user, token]);

    return(
        <View style={styles.container}>
            <Tab value={tabIndex} onChange={setTabIndex} dense>
                <Tab.Item>Itinéraires</Tab.Item>
                {pageType=='update' && <Tab.Item >Participants</Tab.Item>}
                <Tab.Item>Détails</Tab.Item>
            </Tab>
            <TabView value={tabIndex} onChange={setTabIndex} disableSwipe={tabIndex == 0 ? true : false}>
                {/*page map*/}
                <TabView.Item style={{ width: '100%' }} ><Text>test</Text></TabView.Item>
                {/*page participant*/}
                {pageType=='update' && navigationRoute &&<TabView.Item style={{ width: '100%' }} >
                    <View>
                        <View>
                            <Text h3>Propriétaire</Text>
                        </View>
                        <View style={styles.friendCard}>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "start",
                                alignItems: "center"}}>
                                { navigationRoute!==null && <Text style={{paddingEnd: 10}} h4>{navigationRoute.owner.username}</Text>}
                            </View>
                        </View>
                        <View>
                            <View style={{paddingBottom: 10}}>
                                <Text h3>Invités</Text>
                                { navigationRoute!==null && navigationRoute.owner_id === user.id && <Button radius={"sm"} onPress={toggleAddFriendDialog}>Ajouter</Button> }
                            </View>
                            {navigationRoute.members.map(member => {
                                    return <TouchableOpacity key={member.id} style={styles.friendCard}>
                                        <View style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center"}}>
                                            <Text style={{paddingEnd: 10}} h4>{member.username}</Text>
                                            { navigationRoute && navigationRoute.owner_id === user.id && <Button color="error" radius={"sm"} type="solid"
                                                                                           onPress={ () => removeMember(navigationRoute.id, member.id)}>Retirer</Button> }
                                        </View>
                                    </TouchableOpacity>
                                }
                            )}
                        </View>
                        <Dialog
                            isVisible={visibleDialog}
                            onBackdropPress={toggleAddFriendDialog}>
                            <SearchFriendTrip currentFriends={friends} route_id={navigationRoute.id} onClick={addMember}
                                              members={navigationRoute.members} ></SearchFriendTrip>
                        </Dialog>
                        { /* routeSteps.map((marker, i) => (

                        )) */}
                    </View>


                </TabView.Item>}
                {/*page details*/}

                <TabView.Item style={{ width: '100%' }} >
                    <View style={styles.itineraryInfosItem}>
                        {/*<Text h3>{navigationRoute.name}</Text>*/}
                        {/*<Text h4>{navigationRoute.description}</Text>*/}
                    </View>
                </TabView.Item>
            </TabView>
            <View style={styles.saveTripButton}>
                <FloatingButton icon='pencil-outline' />

            </View>
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