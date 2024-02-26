import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UnauthorizedError} from "../errors/ApiCallError";
import StorageService from "./storageService";

export const BASE_URL = `${process.env.API_URL}/${process.env.API_VERSION}`;
axios.defaults.baseURL = BASE_URL
axios.defaults.timeout = 5000
axios.interceptors.request.use(
    async (config) => {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
            config.headers.Authorization = `Bearer ${storedToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(function (response) {
    // Optional: Do something with response data
    return response;
}, function (error) {
    console.log(error.response.status)
    console.log(error.response.data)

    // Do whatever you want with the response error here:
    if (error.response.status === 401) {
        return Promise.reject(UnauthorizedError)
    }
    // But, be SURE to return the rejected promise, so the caller still has
    // the option of additional specialized handling at the call-site:
    return Promise.reject(error);
});
const Api = axios
export default Api;