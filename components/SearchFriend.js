import React, {useRef, useState} from 'react';
import {Text, ScrollView, StyleSheet, View, ActivityIndicator} from 'react-native';
import {Button, SearchBar} from '@rneui/themed';
import axios from "axios";
import {useUser} from "../Guard/WithAuthGuard";

const SearchFriend = ({ currentFriends, friendReceived, friendSent, onAdd }) => {
    const { user, token } = useUser();
    const [search, setSearch] = useState("");
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchDone, setSearchDone] = useState(false);

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
                console.log("response");
                console.log(response.data);
                const friendsFiltered = [];

                for (const friend of response.data) {
                    console.log(friend);
                    if ( !(currentFriends.find( (x) => x.user.id === friend.id)
                        || friendReceived.find( (x) => x.user.id === friend.id)
                        || friendSent.find( (x) => x.user.id === friend.id))

                    ) {
                        friendsFiltered.push(friend);
                    }
                }

                console.log(friendsFiltered);

                setFriends(friendsFiltered);
                setLoading(false);
                setSearchDone(true);

            }
        } catch (error) {
            setFriends([]);
            setLoading(false);
            setSearchDone(true);
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
                onAdd();
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

        timerRef.current = setTimeout(async () => {
            if (searchString && searchString.length > 0 && user) {
                setLoading(true);
                setSearchDone(false);
                await searchUsers(searchString);
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
                {loading && <ActivityIndicator size="small" color="#0000ff" />}
                {searchDone && !loading && friends.length === 0 && <Text>Aucun utilisateur.</Text>}
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