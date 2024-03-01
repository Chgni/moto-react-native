import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {useUser} from "../guards/WithAuthGuard";
import {Header, Tab, TabView, Text} from "@rneui/base";
import {useIsFocused} from "@react-navigation/native";
import RouteService, { getTripsJoined, getTripsOwned} from "../services/RouteService";
import {Button, Icon} from '@rneui/themed';
import RouteCard from "../components/route/RouteCard";
import FloatingButton from "../components/common/FloatingButton";
import RoutesOwned from "../components/route/home-tab/RoutesOwned";
import RoutesJoined from "../components/route/home-tab/RoutesJoined";
import {Appbar, Divider} from "react-native-paper";

const HomeScreen = ({ navigation }) => {
    const [index, setIndex] = React.useState(0);

    const goToCreatePage = () => {
        navigation.navigate('CreateTrip');
    }

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="CommuMoto" />
            </Appbar.Header>
            <Tab value={index} onChange={setIndex} dense>
                <Tab.Item>Mes trajets</Tab.Item>
                <Tab.Item>Trajets rejoints</Tab.Item>
            </Tab>
            <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ width: '100%' }}>
                    <RoutesOwned />
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <RoutesJoined />
                </TabView.Item>
            </TabView>
            <View style={styles.addTripButton}>
                <FloatingButton onPress={goToCreatePage} icon={"plus"} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
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