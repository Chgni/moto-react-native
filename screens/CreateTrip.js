import MapView, { Marker }  from 'react-native-maps';
import {useUser} from "../Guard/WithAuthGuard";
import {useIsFocused} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import StepsComponent from "../components/StepsComponent";
import {Button} from "@rneui/themed";
import MapViewDirections from "react-native-maps-directions";

const CreateTripScreen = ({ navigation }) => {
    const { user, token } = useUser();
    const isFocused = useIsFocused();
    const [position, setPosition] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [routeSteps, setRouteSteps] = useState([]);
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);

    const handleMapPress = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        const newMarker = {
            latitude: latitude,
            longitude: longitude,
            order: routeSteps.length+1,
            key: Math.random().toString()
        };
        setMarkers([...markers, newMarker]);

        setRouteSteps([...routeSteps, newMarker]);
    };

    useEffect(() => {
        if (isFocused && user && token) {

        } else {
            console.log('Screen not focused or user/token not available');
            setMarkers([]);
            setRouteSteps([]);
        }
    }, [isFocused, user, token]);

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
        setMarkers([]);
    };

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
    return (
        <View  style={styles.container}>
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
                {routeSteps.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                    >
                        <View>
                        </View>
                    </Marker>
                ))}
                { routeSteps.length >= 2 && <MapViewDirections
                    origin={getOrigin()}
                    destination={getDestination()}
                    waypoints={getWaypoints()}
                    apikey={"AIzaSyA8GbERy29dn5hEZKj3G1FG8SQoPC9Ocqs"} //AIzaSyA8GbERy29dn5hEZKj3G1FG8SQoPC9Ocqs
                />}
            </MapView>
            <View>
                <Button>Créer itinéraire</Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%"
    },
    mapStyle: {
        width: "100%",
        height: "95%"
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
    friendsContainer: {
        display: "flex",
        flexDirection: "row",
        margin: 10
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    }
});

export default CreateTripScreen;