import React, {useRef, useState} from 'react';
import {Text, ScrollView, StyleSheet, View, ActivityIndicator} from 'react-native';
import {Button, SearchBar} from '@rneui/themed';
import axios from "axios";
import {useUser} from "../guards/WithAuthGuard";
import UserService from "../services/UserService";
import FriendsService from "../services/FriendsService";

const SearchFriend = ({ onAdd }) => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchDone, setSearchDone] = useState(false);
    const timerRef = useRef(null);
    const userService = new UserService()
    const friendsService = new FriendsService()
    const searchUsers = async (searchString) => {
        try {
            const users = await userService.searchBySimilarUsername(searchString)
            setUsers(users);
            setLoading(false);
            setSearchDone(true);

        } catch (error) {
            setUsers([]);
            setLoading(false);
            setSearchDone(true);
        }
    };

    const addUser = async (user) => {
        try {
            const response = await friendsService.sendFriendRequest(user.id)
            onAdd();
        } catch (error) {
            console.log('Cant get friends');
        }
    }

    const updateSearch = (searchString) => {
        setLoading(true)
        setUsers([])
        setSearch(searchString);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(async () => {
            if (searchString && searchString.length > 0) {
                setLoading(true);
                setSearchDone(false);
                await searchUsers(searchString);
            } else {
                setLoading(false)

            }
        }, 1500);
    };

    return (
        <View>
            <SearchBar
                placeholder="Taper un pseudo"
                onChangeText={updateSearch}
                value={search}
                lightTheme={true}
            />
            <ScrollView style={styles.friendsContainer}>
                <View style={[styles.item, { marginTop: 20 }]}>
                    {loading && <ActivityIndicator size="small" color="#0000ff" />}
                    {searchDone && !loading && users.length === 0 && <Text>Aucun utilisateur.</Text>}
                    {users.map(user =>  <View key={user.id} style={styles.friendWrapper}>
                            <Text style={styles.pseudo}>{user.username}</Text>
                            <Button title={"Ajouter"} onPress={ () => addUser(user)}></Button>
                        </View>
                    )}
                </View>

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