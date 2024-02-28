import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View, ActivityIndicator} from 'react-native';
import {Text, Button, SearchBar} from '@rneui/themed';
import axios from "axios";
import {useUser} from "../guards/WithAuthGuard";

const SearchFriendTrip = ({ currentFriends, members, onClick }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const data = [];

        for(const currentFriend of currentFriends) {
            let present = false;
            for(const member of members) {
                if(member.id == currentFriend.requesting_user_id || member.id == currentFriend.target_user_id) {
                    present = true;
                }
            }
            if(present==false) {
                if(currentFriend.current_user == "requesting") {
                    data.push(currentFriend.target_user)
                } else {
                    data.push(currentFriend.requesting_user)
                }
            }

        }
        setUsers(data)
    }, []);

    return (
        <View>
            <ScrollView style={styles.friendsContainer}>
                {users.length === 0 && <Text>Aucun ami à ajouter.</Text>}
                {users.map(user => <View key={user.id} style={styles.friendWrapper}>
                            <Text style={styles.pseudo}>{user.username}</Text>
                            <Button title={"Ajouter"} onPress={() => onClick(user)}></Button>
                        </View>

                )}
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    actions: {
        color: "#fff"
    },
    friendContainer: {
        display: "flex",
        flexDirection: "column",
    },
    friendWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8
    },
    pseudo: {
        fontSize: 18
    }
});

export default SearchFriendTrip;