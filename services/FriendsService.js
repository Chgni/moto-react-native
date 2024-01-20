import axios from "axios";

    const getFriends = async (user, token) => {
        try {
            console.log('Get friends');
            const response = await axios.get(`http://10.0.2.2:8000/api/v1/users/${user['id']}/friends`,{
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
                console.log('Cant get friends');
            }
        }
    };

    const getFriendsRequestsReceived = async (user, token) => {
        try {
            console.log('Get friends received');
            const response = await axios.get(`http://10.0.2.2:8000/api/v1/users/${user['id']}/friends?pending_received=true`,{
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
            const response = await axios.get(`http://10.0.2.2:8000/api/v1/users/${user['id']}/friends?pending_sent=true`,{
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

export {getFriends, getFriendsRequestsReceived, getFriendsRequestsSent};