import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UnauthorizedError} from "../errors/ApiCallError";

export const BASE_URL = `${process.env.API_URL}/${process.env.API_VERSION}`;
const Api = axios.create({
    baseURL: BASE_URL,
});
Api.interceptors.request.use(
    async (config) => {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
            config.headers.Authorization = `Bearer ${storedToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

Api.interceptors.response.use(function (response) {
    // Optional: Do something with response data
    return response;
}, function (error) {
    console.log(error.response.status)
    // Do whatever you want with the response error here:
    if (error.response.status === 401) {
        return Promise.reject(UnauthorizedError)
    }
    // But, be SURE to return the rejected promise, so the caller still has
    // the option of additional specialized handling at the call-site:
    return Promise.reject(error);
});
export default Api;