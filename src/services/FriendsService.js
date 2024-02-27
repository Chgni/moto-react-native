import axios from "axios";
import Api from "./Api";

export default class FriendsService {
    #api = Api
    async getFriends (){
        const response = await this.#api.get(`/friends`);
        return response.data;
    };
    async getFriendsRequestsReceived() {
        const response = await this.#api.get(`/friends?pending_received=true`);
        return response.data;
    }

    async getFriendsRequestsSent() {
        const response = await this.#api.get(`/friends?pending_sent=true`);
        return response.data;
    }
    async sendFriendRequest(target_user_id) {
        const response = await axios.post(`/friends/`,{
                target_user_id: target_user_id
        });
        return response.data
    }
    async deleteFriend(friend, type) {
        let statusId = 2;
        if (type === "friend") {
            statusId = 3;
        }
        await axios.patch(`/friends`, {
                id: friend.id,
                status : statusId
            });
    }
    async acceptFriend(friend){
        await axios.patch(`/friends`, {
                id: friend.id,
                status : 1
            });
    }
}
