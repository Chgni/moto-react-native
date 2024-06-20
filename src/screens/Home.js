import { View, StyleSheet, Linking } from 'react-native';
import React, {useContext, useEffect} from 'react';
import {Tab, TabView} from "@rneui/base";
import RouteService from "../services/RouteService";
import FloatingButton from "../components/common/FloatingButton";
import RoutesList from "../components/route/RoutesList";
import {Appbar, Modal, PaperProvider, Portal, Text} from "react-native-paper";
import StorageService from "../services/storageService"
import AuthService from "../services/AuthService";
import WelcomeScreen from "./Welcome";
import {useUser} from "../guards/WithAuthGuard";
import webSocketService from "../services/WebSocketService";

const HomeScreen = ({ navigation }) => {
    const [index, setIndex] = React.useState(0);
    const routeService = new RouteService();
    const authService = new AuthService();
    const [welcomeModalVisible, setWelcomeModalVisible] = React.useState(false);
    const storageService = new StorageService()
    const {user} = useUser();
    useEffect(() => {
        storageService.getJwt().then(jwt => {
            const url = encodeURI(`ws://${process.env.API_URL}/ws?token=Bearer ${jwt}`);
            webSocketService.initializeSocket(url)
        })


    }, []);
    const hideModal = () => {
        setWelcomeModalVisible(false);
    }
    useEffect(() => {
        storageService.getHideWelcomeMessage().then((hideWelcomeMessage) => {
            if (!hideWelcomeMessage) {
                setWelcomeModalVisible(true)
            }
        })
    }, []);

    const goToCreatePage = () => {
        setWelcomeModalVisible(false)
        navigation.navigate('Route');
    }
    const getRoutesOwned = async () => {
        return await routeService.getRoutes(true, false)
    }
    const getRoutesJoined = async () => {
        return await routeService.getRoutes(false, true)
    }

    const openURL = (url) => {
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(url);
                } else {
                    Alert.alert(`Don't know how to open this URL: ${url}`);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    };

    return (
            <View style={styles.container}>
                <Appbar.Header>
                    <Appbar.Content title={<Text variant='headlineMedium'>CommuMoto - Beta</Text>} />
                    <Appbar.Action icon="comment-question-outline" onPress={() => openURL('https://forms.gle/ZYtryWpYZ2FpJx7Z7')} />
                    <Appbar.Action icon="logout" onPress={() => {
                        authService.disconnect();
                        navigation.replace("Connexion")
                    }} />

                </Appbar.Header>
                <Tab value={index} onChange={setIndex} dense>
                    <Tab.Item>Mes trajets</Tab.Item>
                    <Tab.Item>Trajets rejoints</Tab.Item>
                </Tab>
                <TabView value={index} onChange={setIndex} animationType="spring">
                    <TabView.Item style={{ width: '100%' }}>
                        <RoutesList loadData={getRoutesOwned} routeDeletable={true}/>
                    </TabView.Item>
                    <TabView.Item style={{ width: '100%' }}>
                        <RoutesList loadData={getRoutesJoined} />
                    </TabView.Item>
                </TabView>
                <View style={styles.addTripButton}>
                    <FloatingButton onPress={goToCreatePage} icon={"plus"} text="Créer un trajet" />
                </View>
                <Portal>
                    {user != null && <Modal  visible={welcomeModalVisible} onDismiss={hideModal} contentContainerStyle={styles.welcomeModal}>
                        <WelcomeScreen username={user.username} goToCreatePage={goToCreatePage}/>
                    </Modal>}
                </Portal>
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
    },
    welcomeModal: {
        backgroundColor: 'white',
        padding: 20,
        marginStart: "5%",
        marginEnd: "5%",
        maxHeight: "90%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        borderRadius: 15
    }
});
export default HomeScreen;