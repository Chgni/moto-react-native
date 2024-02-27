import MapView, {Marker, UrlTile} from 'react-native-maps';
import {useUser} from "../guards/WithAuthGuard";
import {useIsFocused} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {StyleSheet, View, Image, TextInput, TouchableOpacity} from "react-native";
import StepsComponent from "../components/StepsComponent";
import {Button, Dialog, Icon, Input} from "@rneui/themed";
import MapViewDirections from "react-native-maps-directions";
import { getTripById, updateTrip } from "../services/RouteService";
import {Tab, TabView, Text} from "@rneui/base";
import FriendsService from "../services/FriendsService";
import SearchFriendTrip from "../components/SeachFriendTrip";
import axios from "axios";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { Snackbar } from 'react-native-paper';

const UpdateTripScreen = ({ navigation, route }) => {
    const { user, token } = useUser();
    const isFocused = useIsFocused();
    const [routeSteps, setRouteSteps] = useState([]);
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [index, setIndex] = React.useState(0);
    const [trip, setTrip] = useState({});
    const [friends, setFriends] = useState([]);
    const [ableToUpdate, setAbleToUpdate] = useState(false);
    const [visibleDialog, setVisibleDialog] = useState(false); // add friend dialog visible
    const [visible, setVisible] = useState(false);
    const friendsService = new FriendsService()

    useEffect(() => {
        if (isFocused && user && token && route.params) {
            const { tripId } = route.params;
            const { created } = route.params;
            if (created) {
                setVisible(true);
            }
            getTrip(tripId);
            getFriendsForCurrentUser();
        } else {
            console.log('Screen not focused or user/token not available');
            setRouteSteps([]);
        }
    }, [isFocused, user, token]);

    const onDismissSnackBar = () => setVisible(false);

    const toggleAddFriendDialog = () => {
        setVisibleDialog(!visibleDialog);
    };

    const getFriendsForCurrentUser = () => {
        friendsService.getFriends().then(
            (response) => {
                setFriends(response);
            }).catch(error => {
                // TODO Error handling
            }
        )
    }

    const getTrip = async (tripId) => {
        await getTripById(tripId, user, token).then(
            (response) => {
                //trip = response;
                setTrip(response);
                let waypoints = response.waypoints;
                for (const waypoint of waypoints) {
                    waypoint.latitude = parseFloat(waypoint.latitude);
                    waypoint.longitude = parseFloat(waypoint.longitude);
                }
                setRouteSteps(response.waypoints);
                if (trip.owner_id === user.id) {
                    setAbleToUpdate(true);
                    setName(trip.name);
                    setDescription(trip.description);
                }
            }
        )
    }

    const handleMapPress = (e) => {
        if (trip.owner_id !== user.id) {
            return;
        }
        const { latitude, longitude } = e.nativeEvent.coordinate;
        const newMarker = {
            latitude: latitude,
            longitude: longitude,
            order: routeSteps.length+1,
            key: Math.random().toString()
        };
        setRouteSteps([...routeSteps, newMarker]);
    };

    const onMarkerDragEnd = (e, index) => {
        const updatedSteps = routeSteps.map((item, i) => {
            if (item.order === index + 1) { // Assuming index is the array index. If it's the order, use `item.order === index + 1`
                return {
                    ...item,
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
                };
            }
            return item;
        });
        setRouteSteps(updatedSteps);
    }

    const deleteStep = (index) => {
        console.log('remove step');
        const filterRouteSteps = routeSteps.filter((currentStep, i) => i !== (index-1));
        // re order steps
        const updatedSteps = filterRouteSteps.map((item, i) => ({
            ...item,
            order: i + 1, // Starting order from 2
        }));

        console.log(updatedSteps);
        setRouteSteps(updatedSteps);
    };

    const getDetails = () => {
        if (ableToUpdate) {
            return (<View style={styles.itineraryInfosItem}>
                <Text h3>{trip.name}</Text>
                <Text h4>{trip.description}</Text>
            </View>);
        }else {
            return (<View style={styles.itineraryInfosItem}>
                <Input onChangeText={setName}></Input>
                <TextInput style={styles.itineraryInfosTextArea} multiline={true} onChangeText={setDescription}></TextInput>
            </View>);
        }
    }

    const getOrigin = () => {
        return {latitude: routeSteps[0].latitude, longitude: routeSteps[0].longitude};
    }

    const getDestination = () => {
        const step = routeSteps[routeSteps.length - 1];
        return {latitude: step.latitude, longitude: step.longitude};
    }

    const getWaypoints = () => {
        console.log("get waypoints");
        const waypoints = [];
        routeSteps.slice(1, routeSteps.length - 1).map( (item) => {
            waypoints.push({latitude: item.latitude, longitude: item.longitude});
        })
        return waypoints;
    }

    const update = async (route_id) => {
        await updateTrip(route_id, routeSteps, token).then(
            (response) => {
                setVisible(true);
            });
    }

    const returnHome = () => {
        navigation.navigate('Main');
    }

    const toggleAddFriendDialogAndRefresh = () => {
        setVisibleDialog(!visibleDialog);
        getTrip(trip.id);
    };

    const removeFriend = async (route_id, friendId) => {
        try {
            console.log(route_id);
            console.log(friendId);
            console.log(token);
            const response = await axios.delete(`http://192.168.1.79:8000/api/v0.1/routes/${route_id}/members`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }, data: {
                        id: friendId
                    }
                });
            if (response.status === 204) {
                await getTrip(route_id);
            }
        } catch (error) {
            if( error.response ){
                // console.log(error.response.data); // => the response payload
                console.log('Cant get friends');
            }
        }
    }

    return (
        <View  style={styles.container}>
            <Tab value={index} onChange={setIndex} dense>
                <Tab.Item>Itinéraires</Tab.Item>
                <Tab.Item>Participants</Tab.Item>
                <Tab.Item>Détails</Tab.Item>
            </Tab>
            { isFocused && user && token && trip && Object.keys(trip).length > 0 && <TabView value={index} onChange={setIndex} disableSwipe={true} animationType="spring">
                <TabView.Item style={{ width: '100%' }}>
                    <View style={{ width: '100%', height: '100%' }}>
                        <StepsComponent steps={routeSteps} tripOwner={trip.owner_id} currentUser={user.id} deleteStep={deleteStep}/>

                        <MapView style={styles.mapStyle}
                                 onPress={handleMapPress}
                                 provider={PROVIDER_GOOGLE}
                                 initialRegion={{
                                     latitude: 43.4496,
                                     longitude: 5.2443,
                                     latitudeDelta: 0.0922,
                                     longitudeDelta: 0.0421,
                                 }}
                        >
                            {routeSteps.map((marker, i) => (
                                <Marker
                                    draggable={trip.owner_id === user.id}
                                    onDragEnd={(e) => onMarkerDragEnd(e, i)}
                                    key={i}
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
                            { trip && routeSteps.length >= 2 && <MapViewDirections
                                origin={getOrigin()}
                                destination={getDestination()}
                                waypoints={getWaypoints()}
                                strokeWidth={3}
                                strokeColor={"blue"}
                                apikey={"AIzaSyDOgfh5J__i5OSXv4XAmIAEKIU6Milw9hQ"}
                            />}
                        </MapView>
                    </View>
                </TabView.Item>
                <TabView.Item style={{ width: '100%', padding: 15 }}>

                    <View>
                        <View>
                            <Text h3>Propriétaire</Text>
                        </View>
                        <View style={styles.friendCard}>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "start",
                                alignItems: "center"}}>
                                { trip && <Text style={{paddingEnd: 10}} h4>{trip.owner.username}</Text>}
                            </View>
                        </View>
                        <View>
                            <View style={{paddingBottom: 10}}>
                                <Text h3>Invités</Text>
                                { trip && trip.owner_id === user.id && <Button radius={"sm"} onPress={toggleAddFriendDialog}>Ajouter</Button> }
                            </View>
                            {trip.members.map(member => {
                                    return <TouchableOpacity key={member.id} style={styles.friendCard}>
                                        <View style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center"}}>
                                            <Text style={{paddingEnd: 10}} h4>{member.username}</Text>
                                            { trip && trip.owner_id === user.id && <Button color="error" radius={"sm"} type="solid"
                                             onPress={ () => removeFriend(trip.id, member.id)}>Retirer</Button> }
                                        </View>
                                    </TouchableOpacity>
                                }
                            )}
                        </View>
                        <Dialog
                            isVisible={visibleDialog}
                            onBackdropPress={toggleAddFriendDialog}>
                            <SearchFriendTrip currentFriends={friends} route_id={trip.id} onAdd={toggleAddFriendDialogAndRefresh}
                            members={trip.members}></SearchFriendTrip>
                        </Dialog>
                        { /* routeSteps.map((marker, i) => (

                        )) */}
                    </View>



                </TabView.Item>
                <TabView.Item style={{width: '100%' }}>
                    <View style={styles.itineraryInfosItem}>
                        <Text h3>{trip.name}</Text>
                        <Text h4>{trip.description}</Text>
                    </View>
                </TabView.Item>
            </TabView>}
            { isFocused && user && token && trip && Object.keys(trip).length > 0 && <View style={styles.saveTripButton}>
                { trip && trip.owner_id === user.id && <Button onPress={() => update(trip.id)} buttonStyle={{borderRadius: 50, width: 75, height: 75}}>
                    <Icon
                        name='save-outline'
                        type='ionicon'
                        color='#fff'
                        size={50}
                    />
                </Button> }
            </View> }
            <View style={styles.returnHomeButton}>
                <Button onPress={() => returnHome()} buttonStyle={{borderRadius: 50, width: 75, height: 75}}>
                    <Icon
                        name='home-outline'
                        type='ionicon'
                        color='#fff'
                        size={50}
                    />
                </Button>
            </View>
            <Snackbar
                visible={visible}
                duration={5000}
                onDismiss={onDismissSnackBar}>
                Itinéraire mis à jour !
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        paddingTop: 20,
        backgroundColor: "#fff"
    },
    itineraryInfos: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    friendCard: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: 'lightgray',
        justifyContent: "center",
        width: "100%",
        borderRadius: 15,
        height: 70,
        padding: 10,
    },
    friendSection: {
        display: "flex",
        width: '100%',
        height: '100%',
        justifyContent: "center",
        alignItems: "center",
    },
    mapStyle: {
        height: "100%",
        width: "100%",
    },
    itineraryInfosItem: {
        marginTop: 10,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: 10
    },
    itineraryInfosTextArea: {
        backgroundColor: 'lightgray',
        width: "100%",
        borderRadius: 15,
        height: 150,
        padding: 10
    },
    friendsButtonContainer: {
        display: "flex",
        flexDirection: "row",
        marginRight: 5,
        marginLeft: 5,
        width: "100%"
    },
    addFriendButton: {
        maxWidth: 100,
        marginLeft: 10
    },
    saveTripButton: {
        position: "absolute",
        right: 10,
        bottom: 20,
        borderRadius: 50
    },
    returnHomeButton: {
        position: "absolute",
        left: 10,
        bottom: 20,
        borderRadius: 50
    },
    friendsContainer: {
        display: "flex",
        flexDirection: "row",
        margin: 10
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    customMarker: {
        position: "absolute",
        top: 0,
        left: 8,
        backgroundColor: "red",
        padding: 2,
        width: 18,
        borderRadius: 20
    },
    markerText: {
        color: "#fff",
        fontWeight: "bold"
        // Add more styling as needed
    }
});

export default UpdateTripScreen;