import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {useUser} from "../Guard/WithAuthGuard";
import {Header} from "@rneui/base";
import SettingHeader from "../components/SettingHeader";
import {useIsFocused} from "@react-navigation/native";
import { getTrips } from "../services/TripService";

const HomeScreen = ({ navigation }) => {
    const { user, token } = useUser();
    const isFocused = useIsFocused();
    const [trips, setTrips] = useState([]);
    const [friendTrips, setFriendTrips] = useState([]);
    const [communityTrips, setCommunityTrips] = useState([]);
    const [loadingTrips, setLoadingTrips] = useState(true);
    const [loadingFriendsTrips, setLoadingFriendsTrips] = useState(true);
    const [loadingCommunityTrips, setLoadingCommunityTrips] = useState(true);

    useEffect(() => {
        if (isFocused && user && token) {
            console.log('get friend start');
            getAllTrips();
        } else {
            console.log('Screen not focused or user/token not available');
        }
    }, [isFocused, user, token]);

    const getAllTrips = async () => {
        await getTrips(user, token).then(
            (response) => {
                if (response) {
                    setTrips(response);
                    setLoadingTrips(false);
                }
            }
        )
    };

    return (
        <View style={styles.container}>
            { user && <Header style={styles.headerStyle}
                    centerComponent={{ text: `Bonjour, ${user.username}`, style: { color: '#fff' } }}
                    rightComponent={<SettingHeader/>}
            /> }
            <ScrollView style={styles.friendsContainer}>
                <Text>Mes itinéraires ({trips.length})</Text>
            </ScrollView>
            <ScrollView style={styles.friendsContainer}>
                <Text>Itinéraires de mes amis ({friendTrips.length})</Text>
            </ScrollView>
            { /*<ScrollView style={styles.friendsContainer}>
                <Text>Itinéraires de la communauté</Text>
            </ScrollView>  */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column"
    },
    headerStyle: {
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
export default HomeScreen;