import React, {useRef, useState} from 'react';
import {Text, ScrollView, StyleSheet, View} from 'react-native';
import {Button, SearchBar} from '@rneui/themed';
import axios from "axios";
import {useUser} from "../Guard/WithAuthGuard";

const SearchFriend = ({ currentFriends, friendReceived, friendSent }) => {
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
                console.log(response.data);
                const friendsFiltered = response.data.filter(friend =>
                    (!currentFriends.some(currentFriend => currentFriend.id === friend.id)
                        && !friendReceived.some(currentFriend => currentFriend.id === friend.id)
                        && !friendSent.some(currentFriend => currentFriend.id === friend.id)));
                    if (friendsFiltered.length > 0) {
                        setFriends(friendsFiltered);
                    }
            }
        } catch (error) {
            if( error.response ){
                // console.log(error.response.data); // => the response payload
                console.log('Cant get friends');
            }
        }
    };

    const addUser = async (user) => {
        try {
            const response = await axios.post(`http://10.0.2.2:8000/api/v1/friends/`,{
                    target_user_id: user.id
                },
                {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {

            }
        } catch (error) {
            if( error.response ){
                // console.log(error.response.data); // => the response payload
                console.log('Cant get friends');
            }
        }
    }

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
                            <Button title={"Ajouter"} onPress={ () => addUser(friend)}></Button>
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