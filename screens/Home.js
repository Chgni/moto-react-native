import React, {useEffect} from 'react';
import {View, Text, ScrollView, ActivityIndicator, StyleSheet} from 'react-native';
import {useUser} from "../Guard/WithAuthGuard";
import {Header} from "@rneui/base";
import SettingHeader from "../components/SettingHeader";
import {Button, Dialog} from "@rneui/themed";
import FriendItem from "../components/FriendItem";
import SearchFriend from "../components/SearchFriend";
import {useIsFocused} from "@react-navigation/native";
import createTrip from "./CreateTrip";


const HomeScreen = ({ navigation }) => {
    const { user, token } = useUser();
    const isFocused = useIsFocused();


    useEffect(() => {
        if (isFocused && user && token) {
            console.log('get friend start');
        } else {
            console.log('Screen not focused or user/token not available');
        }
    }, [isFocused, user, token]);

    createTrip( () => {
        navigation.navigate('CreateTrip');
    })

    return (
        <View style={styles.container}>
            { user && <Header style={styles.headerStyle}
                    centerComponent={{ text: `Bonjour, ${user.username}`, style: { color: '#fff' } }}
                    rightComponent={<SettingHeader/>}
            /> }
            <ScrollView style={styles.friendsContainer}>
                <Text>Mes itinéraires</Text>
                <Button style={styles.addFriendButton} title='Ajouter un itinéraire'
                onPress={createTrip} />
            </ScrollView>
            <ScrollView style={styles.friendsContainer}>
                <Text>Itinéraires de mes amis</Text>
            </ScrollView>
            <ScrollView style={styles.friendsContainer}>
                <Text>Itinéraires de la communauté</Text>
            </ScrollView>
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