import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {useUser} from "../guards/WithAuthGuard";
import {Header, Tab, TabView, Text} from "@rneui/base";
import {useIsFocused} from "@react-navigation/native";
import RouteService, { getTripsJoined, getTripsOwned} from "../services/RouteService";
import {Button, Icon} from '@rneui/themed';
import RouteCard from "../components/RouteCard";
import FloatingButton from "../components/FloatingButton";

const HomeScreen = ({ navigation }) => {
    const { user, token } = useUser();
    const isFocused = useIsFocused();
    const [routes, setRoutes] = useState([]);
    const [joinedTrips, setJoinedTrips] = useState([]);
    const [communityTrips, setCommunityTrips] = useState([]);
    const [loadingTrips, setLoadingTrips] = useState(true);
    const [loadingJoinedTrips, setLoadingJoinedTrips] = useState(true);
    const [loadingCommunityTrips, setLoadingCommunityTrips] = useState(true);
    const [index, setIndex] = React.useState(0);
    const routeService = new RouteService()
    useEffect(() => {
        if (isFocused && user && token) {
            getAllTrips();
        } else {
            console.log('Screen not focused or user/token not available');
        }
    }, [isFocused, user, token]);

    const getAllTrips = async () => {
        setLoadingTrips(true);
        setLoadingJoinedTrips(true);
        routeService.getRoutes(true, false).then(owned_routes => {
            setRoutes(owned_routes)
            setLoadingTrips(false);
        })

        await routeService.getRoutes(false, true).then(joined_routes => {
            setJoinedTrips(joined_routes);
            setLoadingJoinedTrips(false);
        })


    };

    const goToCreatePage = () => {
        navigation.navigate('CreateTrip');
    }

    const goToTripPage = (id) => {
        navigation.navigate('UpdateTrip', {
            tripId: id
        });
    }

    return (
        <View style={styles.container}>
            <Tab value={index} onChange={setIndex} dense>
                <Tab.Item>Mes trajets</Tab.Item>
                <Tab.Item>Trajets rejoints</Tab.Item>
            </Tab>
            <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ width: '100%' }}>
                    <ScrollView style={{ padding: 10}}>
                        { !loadingTrips && routes.map(route => (
                            <RouteCard route={route} onPress={() => goToTripPage(route.id)} />
                        ))}
                    </ScrollView>
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <ScrollView style={{ padding: 10}}>
                        { !loadingJoinedTrips && joinedTrips.map(route => (
                            <RouteCard route={route} onPress={() => goToTripPage(route.id)} />
                        ))}
                    </ScrollView>
                </TabView.Item>
            </TabView>
            <View style={styles.addTripButton}>
                <FloatingButton onPress={goToCreatePage} icon={"add-outline"} />
            </View>
            {/* user && <Header style={styles.headerStyle}
                    centerComponent={{ text: `Bonjour, ${user.username}`, style: { color: '#fff' } }}
                    rightComponent={<SettingHeader/>}
            /> }
            <ScrollView style={styles.friendsContainer}>
                <Text>Mes itinéraires ({routes.length})</Text>
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
        flexDirection: "column",
        height: "100%",
        paddingTop: 15,
        backgroundColor: "#fff"
    },
    tripCard: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: 'lightgray',
        justifyContent: "center",
        width: "100%",
        borderRadius: 15,
        height: 70,
        padding: 10,
        marginTop: 5,
        marginBottom: 5
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
    addTripButton: {
        position: "absolute",
        right: 10,
        bottom: 20,
        borderRadius: 50
    },
    addFriendButton: {
        width: 10,
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