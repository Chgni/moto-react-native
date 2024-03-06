import React from 'react';
import { View, StyleSheet } from 'react-native';
import {Tab, TabView} from "@rneui/base";
import RouteService from "../services/RouteService";
import FloatingButton from "../components/common/FloatingButton";
import RoutesList from "../components/route/RoutesList";
import {Appbar, Text} from "react-native-paper";
import StorageService from "../services/storageService"

const HomeScreen = ({ navigation }) => {
    const [index, setIndex] = React.useState(0);
    const routeService = new RouteService()

    const goToCreatePage = () => {
        navigation.navigate('Route');
    }
    const getRoutesOwned = async () => {
        return await routeService.getRoutes(true, false)
    }
    const getRoutesJoined = async () => {
        return await routeService.getRoutes(false, true)
    }
    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title={<Text variant='headlineMedium'>CommuMoto - Beta</Text>} />
            </Appbar.Header>
            <Tab value={index} onChange={setIndex} dense>
                <Tab.Item>Mes trajets</Tab.Item>
                <Tab.Item>Trajets rejoints</Tab.Item>
            </Tab>
            <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ width: '100%' }}>
                    <RoutesList loadData={getRoutesOwned} />
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <RoutesList loadData={getRoutesJoined} />
                </TabView.Item>
            </TabView>
            <View style={styles.addTripButton}>
                <FloatingButton onPress={goToCreatePage} icon={"plus"} text="Créer un trajet" />
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