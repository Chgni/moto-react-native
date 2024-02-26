import React, {forwardRef, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View, ActivityIndicator} from 'react-native';
import {Text, Button, SearchBar} from '@rneui/themed';
import axios from "axios";
import {useUser} from "../guards/WithAuthGuard";

const SearchFriendTrip = ({ currentFriends, route_id, onAdd, members }) => {
    const { user, token } = useUser();
    const [search, setSearch] = useState("");
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);

    const timerRef = useRef(null);

    const addUser = async (user) => {
        try {
            console.log(user);
            console.log(route_id);
            const response = await axios.post(`http://192.168.1.79:8000/api/v0.1/routes/${route_id}/members`,{
                    id: user.target_user.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            if (response.status === 201) {
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
        if (searchString.length === 0) {
            setFriends([]);
            return;
        }

        const filteredMembers = [];
        for (const member of members) {
            filteredMembers.push(member.id);
        }

        const friendsAbleToAdd = [];
        for (const friend of currentFriends) {
            if (!filteredMembers.includes(friend.target_user.id)) {
                friendsAbleToAdd.push(friend);
            }
        }


        const searchResult = friendsAbleToAdd.filter(item =>
            item.target_user.username.toLowerCase().includes(searchString.toLowerCase())
        );
        setFriends(searchResult);
    };

    return (
        <View>
            <SearchBar
                placeholder="Taper un pseudo"
                onChangeText={updateSearch}
                value={search}
            />
            <ScrollView style={styles.friendsContainer}>
                {search.length === 0 && <Text>Veuillez effectuer une recherche.</Text>}
                {friends.length === 0 && search.length > 0 && <Text>Aucun utilisateur.</Text>}
                {friends.map(friend => {
                        if (friend.username === user.username) {
                            return null; // skip current user
                        }
                        return <View key={friend.id} style={styles.friendWrapper}>
                            <Text style={styles.pseudo}>{friend.target_user.username}</Text>
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

export default SearchFriendTrip;