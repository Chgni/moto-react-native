import Api from "./Api";

export default class UserService {
    #api = Api
    async searchBySimilarUsername(username) {
        const response = await this.#api.get(`/users/?username=${username}`);
        return response.data
    }
}