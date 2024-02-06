import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {useUser} from "../Guard/WithAuthGuard";
import {Header, Tab, TabView, Text} from "@rneui/base";
import SettingHeader from "../components/SettingHeader";
import {useIsFocused} from "@react-navigation/native";
import { getTrips } from "../services/TripService";
import {Button, Icon} from '@rneui/themed';

const HomeScreen = ({ navigation }) => {
    const { user, token } = useUser();
    const isFocused = useIsFocused();
    const [trips, setTrips] = useState([]);
    const [friendTrips, setFriendTrips] = useState([]);
    const [communityTrips, setCommunityTrips] = useState([]);
    const [loadingTrips, setLoadingTrips] = useState(true);
    const [loadingFriendsTrips, setLoadingFriendsTrips] = useState(true);
    const [loadingCommunityTrips, setLoadingCommunityTrips] = useState(true);
    const [index, setIndex] = React.useState(0);

    useEffect(() => {
        if (isFocused && user && token) {
            console.log('get friend start');
            getAllTrips();
        } else {
            console.log('Screen not focused or user/token not available');
        }
    }, [isFocused, user, token]);

    const getAllTrips = async () => {
        setLoadingTrips(true);
        await getTrips(user, token).then(
            (response) => {
                if (response) {
                    setTrips(response);
                    console.log(response);
                    setLoadingTrips(false);
                }
            }
        )
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
                <Tab.Item>Trajets publics</Tab.Item>
            </Tab>
            <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ width: '100%' }}>
                    <ScrollView style={{ padding: 10}}>
                        { !loadingTrips && trips.map(trip => (
                            <View key={trip.id}>
                                <TouchableOpacity onPress={ () => goToTripPage(trip.id)} style={styles.tripCard}>
                                    <Text h4>{trip.name}</Text>
                                    <Text h4 style={{color: "#fff", alignSelf: "flex-end"}}>De moi</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <Text h1>Favorite</Text>
                </TabView.Item>
                <TabView.Item style={{width: '100%' }}>
                    <Text h1>Cart</Text>
                </TabView.Item>
            </TabView>
            <View style={styles.addTripButton}>
                <Button onPress={goToCreatePage} buttonStyle={{borderRadius: 50, width: 75, height: 75}}>
                    <Icon
                        name='add-outline'
                        type='ionicon'
                        color='#fff'
                        size={60}
                    />
                </Button>
            </View>
            {/* user && <Header style={styles.headerStyle}
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