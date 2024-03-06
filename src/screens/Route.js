import React, { useState, useEffect } from 'react';
import {View, StyleSheet, Image, Linking, BackHandler} from 'react-native';
import WaypointsList from '../components/WaypointsList';
import { buildGPX, GarminBuilder } from 'gpx-builder';

import {
    Button,
    Text,
    Divider,
    Appbar,
    Portal,
    Modal,
    PaperProvider,
    Dialog, FAB,
    TextInput
} from 'react-native-paper'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import RouteService from '../services/RouteService';
import { useUser } from '../guards/WithAuthGuard';
import { useIsFocused } from '@react-navigation/native';
import FriendsService from '../services/FriendsService';
import SearchFriendTrip from '../components/SeachFriendTrip';
import {Tab, TabView} from "@rneui/base";
import FloatingButton from "../components/common/FloatingButton";
import MemberCard from "../components/route/MemberCard";
import ContentLoader from "react-native-easy-content-loader";
import Toast from "react-native-simple-toast";
const { Point } = GarminBuilder.MODELS;
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import RouteModel from "../models/RouteModel";
import {Input} from "@rneui/themed";
const RouteScreen = ({ route, navigation }) => {
    const routeService = new RouteService()
    const friendsService = new FriendsService()
    const [openRouteFab, setOpenRouteFab] = useState(false)
    const { user, token, socket } = useUser();
    const [navigationRoute, setNavigationRoute] = useState(null);
    const [friends, setFriends] = useState([]);
    const [waypoints, setWaypoints] = useState([])
    const [visibleMemberModal, setVisibleMemberModal] = useState(false); // add friend dialog visible
    const [visibleNameModal, setVisibleNameModal] = useState(false)
    const [visibleWaypointDialog, setvisibleWaypointDialog] = useState(false); // add friend dialog visible
    const [tabIndex, setTabIndex] = React.useState(0);
    const [pageType, setPageType] = useState(route.params ? "update" : "create") // create / update
    const [loading, setLoading] = useState(true)
    const mapRef = React.createRef();
    const [createName, onChangeCreateName] = useState('')
    const createButtonHandler = () => {
        if (waypoints.length < 2) {
            Toast.show("Veuillez placer au moins 2 points", Toast.SHORT)
            return;
        }
        setVisibleNameModal(true)
    }
    const routeCreate = async () => {
        if (createName.trim().length < 3) {
            Toast.show("Veuillez renseigner un nom d'itinéraire et une description (min 3 et 5 charactères)", Toast.SHORT);
            return
        }
        const filteredWaypoints = [];
        for (let waypoint of waypoints) {
            const filtered = {latitude: parseFloat(waypoint.latitude.toFixed(5)),
                longitude: parseFloat(waypoint.longitude.toFixed(5)), order: waypoint.order, name: "step"};
            filteredWaypoints.push(filtered);
        }
        try {
            const newNavigationRoute = await routeService.create(createName, filteredWaypoints)
            navigation.replace('Route', {
                routeId: newNavigationRoute.id
            })
            Toast.show('Vous pouvez maintenant partager ce trajet !', Toast.SHORT)
        } catch (e) {
            //TODO error handling
        }
    }
    const openInMaps = () => {
        let formattedString = '';
        for(let waypoint of waypoints) {
            formattedString+=`/${waypoint.latitude},${waypoint.longitude}`
        }
        Linking.openURL(`https://www.google.co.in/maps/dir${formattedString}/?action=navigate`);
    }

    const saveGpx = async () => {
        const points = [];
        for(let waypoint of waypoints) {
            points.push(new Point(waypoint.latitude, waypoint.longitude, {
                // ele: 314.715,
                // time: new Date('2018-06-10T17:29:35Z'),
                // hr: 120,
            }))
        }
        const gpxData = new GarminBuilder();
        gpxData.setSegmentPoints(points);
        // gpxData.setWayPoints(points)
        const gpxXml = buildGPX(gpxData.toObject());
        let formattedString = navigationRoute.name.replace(/\s+/g, '-');

        // Supprime les caractères spéciaux en utilisant une expression régulière
        formattedString = formattedString.replace(/[^\w\-]+/g, '');
        try {
            const filePath = FileSystem.documentDirectory + `/${formattedString}.gpx`;
            console.log(filePath)
            await FileSystem.writeAsStringAsync(filePath, gpxXml, { encoding: FileSystem.EncodingType.UTF8 });
            await Sharing.shareAsync(filePath);
            Toast.show('Fichier GPX sauvegardé dans: ' + filePath, Toast.LONG);
        } catch (error) {
            console.error('Error saving GPX file: ', error);
        }
    }
    const deleteWaypoint = (index) => {
        const filterRouteSteps = waypoints.filter((currentStep, i) => i !== (index-1));
        // re order steps
        const updatedSteps = filterRouteSteps.map((item, i) => ({
            ...item,
            order: i + 1, // Starting order from 2
        }));

        setWaypoints(updatedSteps);
        updateWaypoints(updatedSteps)
    };
    const getOrigin = () => {
        return {latitude: waypoints[0].latitude, longitude: waypoints[0].longitude};
    }
    const onMarkerDragEnd = async (e, index) => {
        const updatedSteps = waypoints.map((item, i) => {
            if (item.order === index + 1) { // Assuming index is the array index. If it's the order, use `item.order === index + 1`
                return {
                    ...item,
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
                };
            }
            return item;
        });

        setWaypoints(updatedSteps);
        updateWaypoints(updatedSteps)
    }
    const updateWaypoints = (new_waypoints) => {

        const parsedWaypoints = [];
        for (let step of new_waypoints) {
            const filtered = {latitude: parseFloat(step.latitude.toFixed(5)),
                longitude: parseFloat(step.longitude.toFixed(5)), order: step.order, name: "step"};
            parsedWaypoints.push(filtered);
        }
        if (pageType=="update") {
            let update_route = navigationRoute
            update_route.waypoints = parsedWaypoints
            routeService.update(update_route).then(
                () => {
                    setWaypoints(new_waypoints)
                }).catch(error => {
                // TODO error handling
            })
        } else {
            setWaypoints(new_waypoints)

        }

    }
    const getMapsWaypoints = () => {
        const mapsWaypoints = [];
        waypoints.slice(1, waypoints.length - 1).map( (item) => {
            mapsWaypoints.push({latitude: item.latitude, longitude: item.longitude});
        })
        return mapsWaypoints;
    }
    const handleMapPress = (e) => {
        if (waypoints.length==10) {
            return setvisibleWaypointDialog(true)
        }
        const { latitude, longitude } = e.nativeEvent.coordinate;
        const newMarker = {
            latitude: latitude,
            longitude: longitude,
            order: waypoints.length+1,
            key: Math.random().toString()
        };
        updateWaypoints([...waypoints, newMarker]);
    };

    const loadRoute = async (routeId) => {
        try {
            const navigationRoute = await routeService.getRouteById(routeId)
            setNavigationRoute(navigationRoute)
            setWaypoints(navigationRoute.waypoints)

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
    const toggleAddFriendModal = () => {
        setVisibleMemberModal(!visibleMemberModal);
    }
    const getDestination = () => {
        const step = waypoints[waypoints.length - 1];
        return {latitude: step.latitude, longitude: step.longitude};
    }
    const removeMember = async (memberId) => {
        try {
            await routeService.removeMember(navigationRoute.id, memberId)
            loadData(navigationRoute.id)
        } catch (e) {
            //TODO: error handling
        }
    }
    const addMember = async (user_to_add) => {
        try {
            await routeService.addMember(navigationRoute.id, user_to_add.id)
            loadData(navigationRoute.id)
            toggleAddFriendModal()

        } catch (error) {
            if( error.response ){
                // TODO error handling
            }
        }
    }
    const loadData = (routeId) => {
        loadRoute(routeId).then(() => {

            setLoading(false)
            loadFriendsOfCurrentUser().then(() => {

            })

        })
    }
    useEffect(() => {
        if (pageType == "create" && user) {
            const navigationRoute = new RouteModel(null, null, null, null, null, null, [])
            setNavigationRoute(navigationRoute)
        } else {
            if (user && route.params != undefined) {
                if (socket) {
                    socket.onmessage = (e) => {
                        const msg = JSON.parse(e.data);
                        console.log(msg);
                        if (msg["route-uuid"]) {
                            console.log("trigger update");
                            const { routeId } = route.params;
                            if(routeId) {
                                loadData(routeId)
                            } else {
                                setLoading(false)
                            }
                        }
                    };
                }

                const { routeId } = route.params;
                if(routeId) {
                    loadData(routeId)
                } else {
                    setLoading(false)
                }

                // getTrip(tripId);
                // getFriendsForCurrentUser();
            }
        }

    }, [user, token]);
    const handleBackButtonClick = () => {
        navigation.navigate("Home")
    }
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    }, []);
    return(

        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => {navigation.goBack()}} />
                <Appbar.Content title={pageType == "create" ? <Text variant="headlineMedium">Nouvel itinéraire</Text> : <ContentLoader loading={loading} pRows={0} ><Text variant="headlineMedium">{navigationRoute != null && navigationRoute.name}</Text></ContentLoader>} />
                {/*pageType == 'update' && <Appbar.Action icon="calendar" onPress={() => {}} />*/}
            </Appbar.Header>
            <PaperProvider>
            <Tab value={tabIndex} onChange={setTabIndex} dense style={{display: pageType=='update' ? 'flex' : 'none'}}>
                <Tab.Item>Itinéraires</Tab.Item>
                {pageType=='update' && <Tab.Item >Participants</Tab.Item>}
                {pageType=='update' && <Tab.Item>Détails</Tab.Item>}
            </Tab>
            <TabView value={tabIndex} onChange={setTabIndex} disableSwipe={tabIndex == 0 ? true : false} >
                {/*page map*/}
                {user && navigationRoute &&
                    <TabView.Item style={{ width: '100%' }} >
                    <View style={{ width: '100%', height: '100%' }}>
                        <WaypointsList steps={waypoints} tripOwner={route.owner_id} currentUser={user.id} deleteStep={deleteWaypoint} allowDelete={waypoints.length <= 2 ? false: true}/>

                        <MapView
                                ref={mapRef}
                                style={styles.mapStyle}
                                 onPress={handleMapPress}
                                 provider={PROVIDER_GOOGLE}
                                 initialRegion={{
                                     latitude: 46.603354,
                                     longitude: 1.888334,
                                     latitudeDelta: 10,
                                     longitudeDelta: 10,
                                 }}
                                onMapReady={() => {
                                    if (waypoints.length !== 0) {
                                        mapRef.current.animateToRegion({
                                            latitude: waypoints[0].latitude,
                                            longitude: waypoints[0].longitude,
                                            latitudeDelta: 0.1,
                                            longitudeDelta: 0.1
                                        })
                                    }
                                }}
                        >
                            {waypoints.length != 0 && waypoints.map((marker, index) => (
                                <Marker
                                    draggable={true}
                                    onDragEnd={(e) => onMarkerDragEnd(e, index)}
                                    key={index}
                                    tracksViewChanges={false}
                                    coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                                >
                                    <View>
                                        <Image source={require('../assets/mapmarker.png')} style={{height: 35, width:35 }} />
                                        <View style={styles.customMarker}>
                                            <Text style={styles.markerText}>{marker.order}</Text>
                                        </View>
                                    </View>
                                </Marker>
                            ))}
                            { route && waypoints.length >= 2 && <MapViewDirections
                                precision="high"
                                origin={getOrigin()}
                                destination={getDestination()}
                                waypoints={getMapsWaypoints()}
                                strokeWidth={3}
                                strokeColor={"blue"}
                                apikey={process.env.GOOGLE_MAPS_API_KEY}
                            />}
                        </MapView>
                        <Portal>
                            <Dialog visible={visibleNameModal} onDismiss={() => setVisibleNameModal(false)}>
                                <Dialog.Content>
                                    <TextInput label="Nom" onChangeText={onChangeCreateName} />
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button onPress={() => setVisibleNameModal(false)}>Annuler</Button>
                                    <Button onPress={routeCreate}>Créer l'itinéraire</Button>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>
                    </View>


                </TabView.Item>}
                {/*page participant*/}
                {pageType=='update' && navigationRoute &&
                    <TabView.Item style={{ width: '100%' }} >
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
                                                    <MemberCard user={member}  removeMember={ navigationRoute.owner_id === user.id ? () => removeMember(member.id) : null} />
                                            </View>
                                        )
                                    }
                                )}
                                <Divider />

                            </View>

                        </View>
                            <Portal >
                                <Modal visible={visibleMemberModal}  onDismiss={() => setVisibleMemberModal(false)} contentContainerStyle={styles.modal} >
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

                {pageType=='update' && navigationRoute &&
                    <TabView.Item style={{ width: '100%' }} >
                    <View style={styles.itineraryInfosItem}>
                        {/*<Text h3>{navigationRoute.name}</Text>*/}
                        {/*<Text h4>{navigationRoute.description}</Text>*/}
                    </View>
                </TabView.Item>}
            </TabView>
            <View style={styles.saveTripButton}>
                { pageType == "create" && <FloatingButton icon="plus" text="Créer l'itinéraire" onPress={createButtonHandler} /> }
                { tabIndex == 0 && pageType == "update" && <Portal>
                    <FAB.Group onStateChange={({ open }) => setOpenRouteFab(open)} actions={[
                        {label: 'Exporter en .GPX', icon:'crosshairs-gps', onPress:saveGpx},
                        {label: 'Ouvrir dans Maps (max 10 points)', icon: 'google-maps', onPress:openInMaps},

                    ]} icon={openRouteFab ? 'close' : 'directions'} open={openRouteFab} visible={true} />
                </Portal> }
                { tabIndex == 2 && <FloatingButton icon='pencil-outline' text={"Modifier"} />}
                { tabIndex==1 && navigationRoute!==null && navigationRoute.owner_id === user.id && (
                    <FloatingButton onPress={toggleAddFriendModal} icon={"plus"} text={"Ajouter un membre"} />
                ) }

            </View>
                <Portal>
                    <Dialog visible={visibleWaypointDialog} onDismiss={() => {setvisibleWaypointDialog(false)}}>
                        <Dialog.Title>Désolé</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">La version béta de l'application ne permet pas d'ajouter plus de 9 points</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => {setvisibleWaypointDialog(false)}}>OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
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
        position: "absolute",
        top: 0,
        left: 5,
        backgroundColor: "red",
        padding: 2,
        width: 25,
        borderRadius: 20,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
        display: "flex",
        alignItems: "center"
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