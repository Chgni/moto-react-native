import React, { useState, useEffect } from 'react';
import {View, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import StepsComponent from '../components/StepsComponent';
import { Dialog, Icon, Input, Snackbar } from '@rneui/themed';
import {
    Button,
    Text,
    Divider,
    IconButton,
    MD3Colors,
    Chip,
    Avatar,
    Appbar,
    Portal,
    Modal,
    PaperProvider
} from 'react-native-paper'
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
import MemberCard from "../components/route/MemberCard";
import ContentLoader from "react-native-easy-content-loader";

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

    const [pageType, setPageType] = useState(route.params.routeId ? "update" : "create") // create / update
    const [loading, setLoading] = useState(true)

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
    const loadFriendsOfCurrentUser = async () => {
        try {
            const friends = await friendsService.getFriends()
            setFriends(friends)

        } catch (e) {
            // TODO Error handling
        }
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
        if (user && route.params) {
            const { routeId: routeId } = route.params;
            if(routeId) {
                setPageType('update')
                loadRoute(routeId).then(() => {
                    setLoading(false)
                    loadFriendsOfCurrentUser().then(() => {

                    })

                })
            } else {
                setLoading(false)
            }

            // getTrip(tripId);
            // getFriendsForCurrentUser();
        }
    }, [user, token]);

    return(

        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => {navigation.goBack()}} />
                <Appbar.Content title={pageType == "create" ? 'Nouvel itinéraire' : <ContentLoader loading={loading} pRows={0} ><Text variant={"headlineMedium"}>{navigationRoute != null && navigationRoute.name}</Text></ContentLoader>} />
            </Appbar.Header>
            <PaperProvider>
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
                        <View style={styles.friendCard}>

                        </View>
                        <View>

                            <View>
                                <Divider />
                                <MemberCard role={"Organisateur"} user={navigationRoute.owner} />

                                {navigationRoute.members.map((member, index) => {
                                        return (
                                            <View key={member.id}>
                                                    <Divider />
                                                    <MemberCard user={member}  removeMember={ navigationRoute.owner_id === user.id ? () => removeMember(navigationRoute.id, member.id) : null} />
                                            </View>
                                        )
                                    }
                                )}
                                <Divider />

                            </View>

                        </View>
                            <Portal >
                                <Modal visible={visibleDialog}  onDismiss={() => setVisibleDialog(false)} contentContainerStyle={styles.modal} >
                                    <View>
                                        <SearchFriendTrip currentFriends={friends} route_id={navigationRoute.id} onClick={addMember}
                                                      members={navigationRoute.members} />
                                    </View>
                                </Modal>
                            </Portal>


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
                { tabIndex == 2 && <FloatingButton icon='pencil-outline' text={"Modifier"} />}
                { tabIndex==1 && navigationRoute!==null && navigationRoute.owner_id === user.id && (
                    <FloatingButton onPress={toggleAddFriendDialog} icon={"plus"} text={"Ajouter un membre"} />
                ) }

            </View>
            </PaperProvider>
        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    modal: {
        backgroundColor: 'white',
        padding: 20,
        margin: 10
    },
});
const containerStyle = {backgroundColor: 'white', padding: 20};

export default RouteScreen;