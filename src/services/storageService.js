import AsyncStorage from "@react-native-async-storage/async-storage";

export default class StorageService {
    async setJwt(jwt) {
        await AsyncStorage.setItem('userToken', jwt);
    }

    async getJwt() {
        return await AsyncStorage.getItem('userToken');
    }
    async removeJwt() {
        return await AsyncStorage.removeItem('userToken');

    }

    async getHideWelcomeMessage() {
        const hide = await AsyncStorage.getItem('hideWelcome');
        return hide == "true"
    }
    async doHideWelcomeMessage() {
        await AsyncStorage.setItem('hideWelcome', "true");
    }
}