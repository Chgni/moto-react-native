import React, {createContext, useContext, useEffect, useState} from 'react';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";

// Context to hold and provide user data
const UserContext = createContext({user: null, token: null});

export const useUser = () => useContext(UserContext);

const withAuthGuard = (WrappedComponent) => {
    return (props) => {
        const [isLoading, setLoading] = useState(true);
        //const [user, setUser] = useState(null);
        const [authInfo, setAuthInfo] = useState({ user: null, token: null });
        const navigation = useNavigation();

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const jwt = await AsyncStorage.getItem('userToken');
                    if (!jwt) {
                        // No JWT found, redirect to login
                        setLoading(false);
                        navigation.navigate('Connexion');
                    } else {
                        setLoading(false);
                        try {
                            const response = await axios.get('http://192.168.8.92:8000/api/v0.1/auth/me',{
                                headers: {
                                    Authorization: `Bearer ${jwt}`
                                }
                            });

                            if (response.status === 401) {
                                alert('TODO CLEAR JWT AND REDIRECT TO LOGIN!');
                            }

                            if (response.status === 200) {
                                setAuthInfo({ user: response.data, token: jwt });
                                // console.log('guard user got');
                            }
                        } catch (error) {
                            if( error.response ){
                                console.log(error.response.data); // => the response payload
                            }
                        }
                    }
                } catch (error) {
                    console.error(error);
                    navigation.navigate('Connexion');
                }
            };

            checkAuth();
        }, [navigation]);

        if (isLoading) {
            return <Text>Loading ...</Text>;
        }

        return (
            <UserContext.Provider value={authInfo}>
                <WrappedComponent {...props} />
            </UserContext.Provider>
        );
    };
};

export default withAuthGuard;