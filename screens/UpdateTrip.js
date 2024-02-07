import MapView, {Marker, UrlTile} from 'react-native-maps';
import {useUser} from "../Guard/WithAuthGuard";
import {useIsFocused} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {ScrollView, StyleSheet, View, Image, TextInput} from "react-native";
import StepsComponent from "../components/StepsComponent";
import {Button, Icon, Input} from "@rneui/themed";
import MapViewDirections from "react-native-maps-directions";
import { getTripById, updateTrip } from "../services/TripService";
import {Tab, TabView, Text} from "@rneui/base";
import {getFriends} from "../services/FriendsService";

const UpdateTripScreen = ({ route }) => {
    const { user, token } = useUser();
    const isFocused = useIsFocused();
    const [routeSteps, setRouteSteps] = useState([]);
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [index, setIndex] = React.useState(0);
    const [trip, setTrip] = useState({});
    const [friends, setFriends] = useState([]);
    const [ableToUpdate, setAbleToUpdate] = useState(false);


    useEffect(() => {
        if (isFocused && user && token && route.params) {
            const { tripId } = route.params;
            getTrip(tripId);

            /*
            getFriends(user, token).then(
                (response) => {
                    if (response) {
                        setFriends(response);

                    }
                }
            )*/
        } else {
            console.log('Screen not focused or user/token not available');
            setRouteSteps([]);
        }
    }, [isFocused, user, token]);

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
                console.log("trip");
                console.log(trip);
                if (trip.owner_id === user.id) {
                    setAbleToUpdate(true);
                    setName(trip.name);
                    setDescription(trip.description);
                }
            }
        )
    }

    const handleMapPress = (e) => {
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
        const waypoints = [];
        routeSteps.slice(1, routeSteps.length - 1).map( (item) => {
            waypoints.push({latitude: item.latitude, longitude: item.longitude});
        })
        return waypoints;
    }

    const update = async (route_id) => {
        await updateTrip(route_id, routeSteps, token).then(
            (response) => {
                alert(response.data);
            });
    }

    return (
        <View  style={styles.container}>
            <Tab value={index} onChange={setIndex} dense>
                <Tab.Item>Itinéraires</Tab.Item>
                <Tab.Item>Participants</Tab.Item>
                <Tab.Item>Détails</Tab.Item>
            </Tab>
            { isFocused && user && token && <TabView value={index} onChange={setIndex} disableSwipe={true} animationType="spring">
                <TabView.Item style={{ width: '100%' }}>
                    <View style={{ width: '100%', height: '100%' }}>
                        <StepsComponent steps={routeSteps} deleteStep={deleteStep}/>
                        <MapView style={styles.mapStyle}
                                 onPress={handleMapPress}
                                 initialRegion={{
                                     latitude: 43.4496,
                                     longitude: 5.2443,
                                     latitudeDelta: 0.0922,
                                     longitudeDelta: 0.0421,
                                 }}
                        >
                            {routeSteps.map((marker, i) => (
                                <Marker
                                    draggable={true}
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
                            { routeSteps.length >= 2 && <MapViewDirections
                                origin={getOrigin()}
                                destination={getDestination()}
                                waypoints={getWaypoints()}
                                strokeWidth={3}
                                strokeColor={"blue"}
                                apikey={"AIzaSyA8GbERy29dn5hEZKj3G1FG8SQoPC9Ocqs"} //
                            />}
                        </MapView>
                        <View style={styles.saveTripButton}>
                            { trip.owner_id === user.id && <Button onPress={() => update(trip.id)} buttonStyle={{borderRadius: 50, width: 75, height: 75}}>
                                <Icon
                                    name='save-outline'
                                    type='ionicon'
                                    color='#fff'
                                    size={50}
                                />
                            </Button> }
                        </View>
                    </View>
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                </TabView.Item>
                <TabView.Item style={{width: '100%' }}>
                    <View style={styles.itineraryInfosItem}>
                        <Text h3>{trip.name}</Text>
                        <Text h4>{trip.description}</Text>
                    </View>
                </TabView.Item>
            </TabView>}
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