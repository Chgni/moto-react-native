import axios from "axios";

    const getFriends = async (user, token) => {
        try {
            console.log('Get friends');
            const response = await axios.get(`http://82.65.153.125:8888/api/v0.1/friends`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            if( error.response ){
                console.log('Cant get friends');
            }
        }
    };

    const getFriendsRequestsReceived = async (user, token) => {
        try {
            console.log('Get friends received');
            const response = await axios.get(`http://82.65.153.125:8888/api/v0.1/friends?pending_received=true`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            if( error.response ){
                // console.log(error.response.data); // => the response payload
                console.log('Cant get friends received');
            }
        }
    };

    const getFriendsRequestsSent = async (user, token) => {
        try {
            console.log('Get friends sent');
            const response = await axios.get(`http://82.65.153.125:8888/api/v0.1/friends?pending_sent=true`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            if( error.response ){
                // console.log(error.response.data); // => the response payload
                console.log('Cant get friends sent');
            }
        }
    };

const deleteFriend = async (friend, type, token) => {
    try {
        console.log(friend);
        let statusId = 2;
        if (type === "friend") {
            statusId = 3;
        }
        const response = await axios.patch(`http://82.65.153.125:8888/api/v0.1/friends/`, {
                id: friend.id,
                status : statusId
            }
            , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        if (response.status === 204) {
            return true;
        }else {
            return false;
        }

    } catch (error) {
        if( error.response ){
            // console.log(error.response.data); // => the response payload
            console.log(error.response.data);
        }
    }
}

const acceptFriend = async (friend, type, token) => {
    try {
        console.log(friend);
        const response = await axios.patch(`http://82.65.153.125:8888/api/v0.1/friends/`, {
                id: friend.id,
                status : 1
            }
            , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        if (response.status === 204) {
            return true;
        }else {
            return false;
        }

    } catch (error) {
        if( error.response ){
            // console.log(error.response.data); // => the response payload
            console.log(error.response.data);
        }
    }
}

export {getFriends, getFriendsRequestsReceived, getFriendsRequestsSent, deleteFriend, acceptFriend};