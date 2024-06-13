import React, { createContext, useState, useEffect } from 'react';
import FriendsService from "../services/FriendsService";
import StorageService from "../services/storageService";
import AuthService from "../services/AuthService";
import axios from "axios";

export const WebSocketContext = createContext({ websocket: null, openWebSocket: () => {} });

export const WebSocketProvider = ({ children }) => {
    const friendsService = new FriendsService()
    const storageService = new StorageService()
    const authService = new AuthService()
    const jwtService = new StorageService()
    const [websocket, setWebsocket] = useState(null)
    const [friendRequests, setFriendRequests] = useState(0);



    const openWebSocket = async () => {
        const jwt = await jwtService.getJwt();
        const response = await axios.get(`${process.env.API_URL}/${process.env.API_VERSION}/auth/me`);
        if (response.status === 200) {
            const url = encodeURI(`ws://${process.env.API_URL}/ws?token=Bearer ${jwt}`);

            setWebsocket((new WebSocket(url)));

            
        }
    }
    return (
        <WebSocketContext.Provider value={{ websocket, openWebSocket }}>
            {children}
        </WebSocketContext.Provider>
    );
};
