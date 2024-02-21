import AsyncStorage from "@react-native-async-storage/async-storage";

export default class JwtService {
    async setJwt(jwt) {
        await AsyncStorage.setItem('userToken', jwt);
    }

    async getJwt() {
        return await AsyncStorage.getItem('userToken');
    }
    async removeJwt() {
        return await AsyncStorage.removeItem('userToken');

    }
}