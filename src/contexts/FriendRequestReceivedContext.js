import React, { createContext, useState, useEffect } from 'react';
import FriendsService from "../services/FriendsService";
import StorageService from "../services/storageService";
import AuthService from "../services/AuthService";

export const FriendRequestReceivedContext = createContext({ friendRequests: 0, fetchFriendRequests: () => {} });

export const FriendRequestProvider = ({ children }) => {
    const friendsService = new FriendsService()
    const storageService = new StorageService()
    const authService = new AuthService()

    const [friendRequests, setFriendRequests] = useState(0);

    const fetchFriendRequests = async () => {
        try {
            const jwt = await storageService.getJwt()
            if (jwt) {
                const requests = await friendsService.getFriendsRequestsReceived();
                setFriendRequests(requests.length);
            }
        } catch (e) {
            if (e.name == "UnauthorizedError") {
                await authService.disconnect()
            }
        }
    };

    useEffect(() => {

        fetchFriendRequests().then(() => {}).catch(() => {});

        const interval = setInterval(fetchFriendRequests, 5000); // Mise à jour toutes les 5 secondes
        return () => clearInterval(interval);
    }, []);

    return (
        <FriendRequestReceivedContext.Provider value={{ friendRequests, fetchFriendRequests }}>
            {children}
        </FriendRequestReceivedContext.Provider>
    );
};
