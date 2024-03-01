import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View, ActivityIndicator} from 'react-native';
import {Text, Button} from 'react-native-paper';
import axios from "axios";
import {useUser} from "../guards/WithAuthGuard";
import MemberCard from "./route/MemberCard";

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
                {users.map(user => <View key={user.id}>
                            <MemberCard user={user} addMember={() => {onClick(user)}} />
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

    pseudo: {
        fontSize: 18
    }
});

export default SearchFriendTrip;