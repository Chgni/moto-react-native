import MapView, { Marker }  from 'react-native-maps';
import {useUser} from "../Guard/WithAuthGuard";
import {useIsFocused} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import StepsComponent from "../components/StepsComponent";

const CreateTripScreen = ({ navigation }) => {
    const { user, token } = useUser();
    const isFocused = useIsFocused();
    const [position, setPosition] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [routeSteps, setRouteSteps] = useState([]);

    const handleMapPress = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        const newMarker = {
            latitude: latitude,
            longitude: longitude,
            order: markers.length+1,
            key: Math.random().toString()
        };
        setMarkers([...markers, newMarker]);

        setRouteSteps([...routeSteps, newMarker]);
    };

    useEffect(() => {
        if (isFocused && user && token) {

        } else {
            console.log('Screen not focused or user/token not available');
        }
    }, [isFocused, user, token]);

    return (
        <View  style={styles.container}>
            <StepsComponent steps={routeSteps} />
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
                    />
                ))}
            </MapView>
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
        height: "100%"
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