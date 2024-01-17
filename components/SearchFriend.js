import React, {useRef, useState} from 'react';
import {Text, ScrollView, StyleSheet, View} from 'react-native';
import {Button, SearchBar} from '@rneui/themed';
import axios from "axios";
import {useUser} from "../Guard/WithAuthGuard";

const SearchFriend = ({ currentFriends }) => {
    const { user, token } = useUser();
    const [search, setSearch] = useState("");
    const [friends, setFriends] = useState([]);

    const timerRef = useRef(null);

    const searchUsers = async (searchString) => {
        try {
            const response = await axios.get(`http://10.0.2.2:8000/api/v1/users/`,{
                params: {
                    username: searchString
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setFriends([]);
                setFriends(response.data.filter(friend =>
                    !currentFriends.some(currentFriend => currentFriend.id === friend.id)));
            }
        } catch (error) {
            if( error.response ){
                // console.log(error.response.data); // => the response payload
                console.log('Cant get friends');
            }
        }
    };

    const updateSearch = (searchString) => {
        setSearch(searchString);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            if (searchString && searchString.length > 0 && user) {
                searchUsers(searchString);
            }
        }, 1500);
    };

    return (
        <View>
            <SearchBar
                placeholder="Taper un pseudo"
                onChangeText={updateSearch}
                value={search}
            />
            <ScrollView style={styles.friendsContainer}>
                {friends.map(friend => {
                    if (friend.username === user.username) {
                        return null; // skip current user
                    }
                  return <View key={friend.id} style={styles.friendWrapper}>
                            <Text style={styles.pseudo}>{friend.username}</Text>
                            <Button title={"Ajouter"}></Button>
                        </View>
                }
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

export default SearchFriend;