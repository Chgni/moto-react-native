import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, Image, Linking, BackHandler, ScrollView} from 'react-native';
import WaypointsList from '../components/WaypointsList';
import { buildGPX, GarminBuilder } from 'gpx-builder';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    Button,
    Text,
    Divider,
    Appbar,
    Portal,
    Modal,
    Dialog, FAB,
    TextInput, Surface, IconButton
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
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faMugSaucer} from "@fortawesome/free-solid-svg-icons/faMugSaucer";
import {faLocation} from "@fortawesome/free-solid-svg-icons/faLocation";
import {faLocationDot} from "@fortawesome/free-solid-svg-icons/faLocationDot";
import webSocketService from "../services/WebSocketService";
import Waypoint from "../components/route/Waypoint";
import UserWaypoint from "../components/route/UserWaypoint";
import waypoint from "../components/route/Waypoint";
const RouteScreen = ({ route, navigation }) => {
    const routeService = new RouteService()
    const friendsService = new FriendsService()
    const [openRouteFab, setOpenRouteFab] = useState(false)
    const { user, token} = useUser();
    const [navigationRoute, setNavigationRoute] = useState(null);
    const [friends, setFriends] = useState([]);
    const [waypoints, setWaypoints] = useState([])
    const [visibleMemberModal, setVisibleMemberModal] = useState(false); // add friend dialog visible
    const [visibleNameModal, setVisibleNameModal] = useState(false)
    const [visibleWaypointDialog, setvisibleWaypointDialog] = useState(false); // add friend dialog visible
    const [tabIndex, setTabIndex] = React.useState(0);
    const [pageType, setPageType] = useState(route.params ? "update" : "create") // create / update
    const [loading, setLoading] = useState(true)
    const [totalDistance, setTotalDistance] = useState(null);
    const [totalTime, setTotalTime] = useState(null);
    const mapRef = React.createRef();
    const [createName, onChangeCreateName] = useState('')
    const [wayPointSelectionMode, setWayPointSelectionMode] = useState(false)
    const [date, setDate] = useState(new Date());
    const [datePickerMode, setDatePickerMode] = useState('date');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onChange = (event, selectedDate) => {
        if (event.type == 'set') {
            setShowDatePicker(false);
            if (datePickerMode == 'date') {
                setDate(selectedDate);
                showTimepicker();
            } else {
                setDate(selectedDate);
                const updatedNavigationRoute = { ...navigationRoute, date: selectedDate };
                selectedDate = formatFrenchDate(selectedDate);
                updatedNavigationRoute.date = selectedDate

                setNavigationRoute(updatedNavigationRoute);
                //appel api update date
                updateDate(navigationRoute, selectedDate);
                // Toast.show("Date mise à jour !", Toast.SHORT)
            }
        }
    };


    const showMode = (currentMode) => {
        setDatePickerMode(currentMode);
        setShowDatePicker(true);

    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };


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

    const routePatch = async (route, distance, duration) => { //patch total time and distance
        try {
            const newNavigationRoute = await routeService.patch(route, distance, duration)
        } catch (e) {
            //TODO error handling
        }
    }
    const openInMaps = () => {
        let formattedString = '';
        for(let waypoint of getRouteWaypoints()) {
            formattedString+=`/${waypoint.latitude},${waypoint.longitude}`
        }
        Linking.openURL(`https://www.google.co.in/maps/dir${formattedString}/?action=navigate`);
    }

    const saveGpx = async () => {
        const points = [];
        for(let waypoint of getRouteWaypoints()) {
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
        return {latitude: getRouteWaypoints()[0].latitude, longitude: getRouteWaypoints()[0].longitude};
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
    const getRouteWaypoints = () => {
        return waypoints.filter((waypoint) => waypoint.order != null)
    }
    const getMapsWaypointsExceptLastOne = () => {

        const mapsWaypoints = [];
        getRouteWaypoints().slice(1, getRouteWaypoints().length - 1).map( (item) => {
            mapsWaypoints.push({latitude: item.latitude, longitude: item.longitude, order: item.order});
        })
        return mapsWaypoints;
    }
    const handleMapPress = (e) => {
        if (wayPointSelectionMode == true) {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            let alreadyPlacedWaypoint =waypoints.find((waypoint) => waypoint.order == null) //TODO: change the condition after the api is changed for waypoint.user.id == user.id
            if (alreadyPlacedWaypoint) {
                const updated_waypoints = waypoints
                const indexOfPlacedWaypoint = waypoints.findIndex((waypoint) => waypoint == alreadyPlacedWaypoint)
                updated_waypoints.splice(indexOfPlacedWaypoint, 1)
                const newMarker = {
                    latitude: latitude,
                    longitude: longitude,
                    order: null,
                    key: Math.random().toString()
                };
                updateWaypoints([...waypoints, newMarker]);

            } else {
                const newMarker = {
                    latitude: latitude,
                    longitude: longitude,
                    order: null,
                    key: Math.random().toString()
                };
                updateWaypoints([...waypoints, newMarker]);
            }

        } else {
            if (waypoints.length==10) {
                return setvisibleWaypointDialog(true)
            }
            const { latitude, longitude } = e.nativeEvent.coordinate;
            const newMarker = {
                latitude: latitude,
                longitude: longitude,
                order: getRouteWaypoints().length+1,
                key: Math.random().toString()
            };
            updateWaypoints([...waypoints, newMarker]);

        }

    };

    const formatFrenchDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('fr-FR', { timeZone: 'Europe/Paris',
            day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
         });
    };

    const loadRoute = async (routeId) => {
        try {
            const navigationRoute = await routeService.getRouteById(routeId)

            setNavigationRoute(navigationRoute)
            if (navigationRoute.date != null) {
                const date = formatFrenchDate(navigationRoute.date);
                navigationRoute.date = date;
                setNavigationRoute(navigationRoute)
            }
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
        const step = getRouteWaypoints()[getRouteWaypoints().length - 1];
        console.log("destination")
        console.log(step)
        return {latitude: step.latitude, longitude: step.longitude, order: step.order};
    }
    const removeMember = async (memberId) => {
        try {
            await routeService.removeMember(navigationRoute.id, memberId)
            loadData(navigationRoute.id)
        } catch (e) {
            //TODO: error handling
        }
    }
    const updateRight = async (route, member) => {
        try {
            console.log('test');
            await routeService.updateRight(route, member).then(
                () => {
                    Toast.show("Droit modifié !", Toast.SHORT)
                }
            )
        } catch (e) {
            Toast.show("Erreur : droit non modifié !", Toast.SHORT)
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

    const updateDate = async (route, date) => {
        try {
            console.log(date);
            await routeService.updateDate(route, date).then(
                () => {
                    Toast.show("Date mise à jour !", Toast.SHORT)
                }
            )
        } catch (error) {
            if( error.response ){
                Toast.show("Date non mise à jour !", Toast.SHORT)
            }
        }
    }

    const convertMinsToTime = (mins) => {
        if (mins < 60) {
            return `${mins} mins`;
        }
        let hours = Math.floor(mins / 60);
        let minutes = mins % 60;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}h${minutes}`;
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
                if (webSocketService.socket) {
                    webSocketService.socket.addEventListener('message', (e) => {
                        const msg = JSON.parse(e.data);
                        if (msg["route-uuid"]) {
                            const { routeId } = route.params;
                            if(routeId) {
                                loadData(routeId)
                            } else {
                                setLoading(false)
                            }
                        }
                    })
                    // websocket.onmessage = (e) => {
                    //     const msg = JSON.parse(e.data);
                    //     if (msg["route-uuid"]) {
                    //         const { routeId } = route.params;
                    //         if(routeId) {
                    //             loadData(routeId)
                    //         } else {
                    //             setLoading(false)
                    //         }
                    //     }
                    // };
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
    const enableSelectWayPointMode = () => {
        setWayPointSelectionMode(true)

    }
    const cancelSelectWayPointMode = () => {
        setWayPointSelectionMode(false)
    }
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
                <Appbar.Content
                    title={pageType == "create" ?
                        <>
                            <Text variant="headlineMedium">Nouvel itinéraire </Text>
                            {/*<View>*/}
                            {/*    {showDatePicker && (*/}
                            {/*        <DateTimePicker*/}
                            {/*            testID="dateTimePicker"*/}
                            {/*            value={date}*/}
                            {/*            mode={datePickerMode}*/}
                            {/*            is24Hour={true}*/}
                            {/*            display="default"*/}
                            {/*            onChange={onChange}*/}
                            {/*        />*/}
                            {/*    )}*/}
                            {/*</View>*/}
                        </>
                        :
                        <ContentLoader loading={loading} pRows={0} >
                            <Text variant="headlineMedium">{navigationRoute != null && navigationRoute.name}</Text>
                            <View>
                                {showDatePicker && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={date}
                                        mode={datePickerMode}
                                        is24Hour={true}
                                        display="default"
                                        onChange={onChange}
                                    />
                                )}
                            </View>
                            {navigationRoute && navigationRoute.date && <Text style={styles.date} variant="headlineMedium"> {navigationRoute.date.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })} </Text>}
                        </ContentLoader>}
                />
                { pageType == 'update' && < Appbar.Action icon="calendar" onPress={showDatepicker} /> }
                {/*pageType == 'update' && <Appbar.Action icon="calendar" onPress={() => {}} />*/}
            </Appbar.Header>
            <Tab value={tabIndex} onChange={setTabIndex} dense style={{display: pageType=='update' ? 'flex' : 'none'}}>
                <Tab.Item>Itinéraires</Tab.Item>
                {pageType=='update' && <Tab.Item >Participants</Tab.Item>}
            </Tab>
            <TabView value={tabIndex} onChange={setTabIndex} disableSwipe={tabIndex == 0 ? true : false} >
                {/*page map*/}
                {user && navigationRoute &&
                    <TabView.Item style={{ width: '100%' }} >
                    <View style={{ width: '100%', height: '100%' }}>
                        <Surface style={styles.surface} elevation={4}>
                            {wayPointSelectionMode == false && <ScrollView style={styles.menu}>
                                {pageType == "update" && wayPointSelectionMode == false && <View style={{marginStart: 10, marginEnd: 10, marginTop: 5}}>
                                    <View><Text variant="bodySmall">Vous rejoignez en cours de route ?</Text></View>
                                    <View><Button style={{margin: 0}} compact={true} onPress={()=>{enableSelectWayPointMode()}}>Selectionnez votre point de depart</Button></View>

                                </View>}
                                <WaypointsList steps={getRouteWaypoints()} tripOwner={route.owner_id} currentUser={user.id} deleteStep={deleteWaypoint} allowDelete={getRouteWaypoints().length <= 2 ? false: true}/>
                            </ScrollView>}

                        </Surface>
                        <View style={{height: "100%", width: "100%",
                            borderColor: "#ff8700",
                            borderWidth: wayPointSelectionMode == false ? 0: 5

                        }}
                        >

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
                                    if (getRouteWaypoints().length !== 0) {
                                        mapRef.current.animateToRegion({
                                            latitude: getRouteWaypoints()[0].latitude,
                                            longitude: getRouteWaypoints()[0].longitude,
                                            latitudeDelta: 0.1,
                                            longitudeDelta: 0.1
                                        })
                                    }
                                }}
                            >
                                {getRouteWaypoints().length != 0 && waypoints.map((marker, index) => {
                                    if (marker.order == null) {
                                        return (<UserWaypoint key={index} marker={marker} index={index} onMarkerDragEnd={onMarkerDragEnd} /> )
                                    }
                                    return ( <Waypoint key={index} marker={marker} index={index} onMarkerDragEnd={onMarkerDragEnd} />
                                        )
                                })}
                                { route && getRouteWaypoints().length >= 2 && <MapViewDirections
                                    precision="high"
                                    origin={getOrigin()}
                                    destination={getDestination()}
                                    waypoints={getMapsWaypointsExceptLastOne()}
                                    onReady={result => {
                                        setTotalDistance(result.distance);
                                        setTotalTime(result.duration);
                                        if (getMapsWaypointsExceptLastOne().length >= 2 && pageType == "update") {
                                            //routePatch(route.params.routeId, result.distance.toFixed(), result.duration.toFixed());
                                        }
                                    }}
                                    strokeWidth={3}
                                    strokeColor={"#34a4eb"}
                                    apikey={process.env.GOOGLE_MAPS_API_KEY}
                                />}
                            </MapView>
                            {wayPointSelectionMode == true && <View style={{position: "absolute", top: 0, right: 0}}><IconButton mode="contained" icon="close" onPress={cancelSelectWayPointMode} /></View>}

                        </View>

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
                                                    <MemberCard user={member} updateRight={() => updateRight(navigationRoute, member)}
                                                                route={navigationRoute}
                                                                removeMember={ navigationRoute.owner_id === user.id ? () => removeMember(member.id) : null} />
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
            <View style={styles.totalsInfosRouteContainer}>
                {totalTime && totalDistance && <View style={styles.totalInfosRoute}>
                    <Text>Distance: {totalDistance.toFixed()} Kms</Text>
                    <Text>Temps: {convertMinsToTime(totalTime.toFixed())}</Text>
                </View>}
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
        </View>

    )

}

const styles = StyleSheet.create({
    menu: {

        backgroundColor: 'white',
        borderRadius: 5,

    },
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
    totalsInfosRouteContainer: {
        position: 'absolute',
        left: 10,
        bottom: 20,
        borderRadius: 5,
        backgroundColor: '#fff',
        padding: 5
    },

    totalsInfosRouteInfos: {
        display: 'flex',
        flexDirection: 'column',
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        margin: 10
    },
    surface: {
        position: 'absolute',
        top: 30,
        left: 30,
        right: 30,
        maxHeight: 157,
        zIndex: 10,
    },
});
const containerStyle = {backgroundColor: 'white', padding: 20};

export default RouteScreen;