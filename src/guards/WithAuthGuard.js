import React, {createContext, useContext, useEffect, useState} from 'react';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import StorageService from "../services/storageService";
import Api from "../services/Api";

// Context to hold and provide user data
const UserContext = createContext({user: null, token: null});

export const useUser = () => useContext(UserContext);

const withAuthGuard = (WrappedComponent) => {
    return (props) => {
        const [isLoading, setLoading] = useState(true);
        //const [user, setUser] = useState(null);
        const [authInfo, setAuthInfo] = useState({ user: null, token: null});
        const navigation = useNavigation();
        const jwtService = new StorageService()
        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const jwt = await jwtService.getJwt();
                    if (!jwt) {
                        // No JWT found, redirect to login
                        setLoading(false);
                        navigation.navigate('Connexion');
                    } else {

                        setLoading(false);
                        try {

                            const response = await Api.get(`/auth/me`);
                            if (response.status === 401) {
                                alert('TODO CLEAR JWT AND REDIRECT TO LOGIN!');
                            }

                            if (response.status === 200) {

                                setAuthInfo({ user: response.data, token: jwt });
                            }
                        } catch (error) {
                            if( error.response ){
                                // TODO error handling
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


        return (
            <UserContext.Provider value={authInfo}>
                <WrappedComponent {...props} />
            </UserContext.Provider>
        );
    };
};

export default withAuthGuard;