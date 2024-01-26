import MapView from 'react-native-maps';
import {useUser} from "../Guard/WithAuthGuard";
import {useIsFocused} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";

const CreateTripScreen = ({ navigation }) => {
    const { user, token } = useUser();
    const isFocused = useIsFocused();
    const [position, setPosition] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handlePress = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
        console.log(selectedLocation);
    };

    useEffect(() => {
        if (isFocused && user && token) {

        } else {
            console.log('Screen not focused or user/token not available');
        }
    }, [isFocused, user, token]);

    return (
        <View  style={styles.container}>
            <MapView style={styles.mapStyle}
                     onPress={handlePress}
                initialRegion={{
                    latitude: 43.4496,
                    longitude: 5.2443,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            />
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