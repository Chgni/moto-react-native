import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UnauthorizedError, UnprocessableEntityError} from "../errors/ApiCallError";
import StorageService from "./storageService";
import Toast from "react-native-simple-toast";
import {ToastAndroid} from "react-native";

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
    // Do whatever you want with the response error here:
    if(error.response) {
        if (error.response.status === 401) {

            return Promise.reject(UnauthorizedError)
        }
        if (error.response.status === 404) {
            console.log(error.response.data.detail)
        }
        if (error.response.status === 422) {
            let _error = new UnprocessableEntityError()
            _error.details = error.response.data.detail
            return Promise.reject(_error)
            //detail is an array of:
            // {
            //     "type": "missing",
            //     "loc": [
            //          "body",
            //          0,
            //          "name"
            //      ],
            //     "msg": "Field required",
            //     "input": {
            //          "latitude": -90
            //      },
            // }
            // (example)
        }
    } else {
        Toast.show('Une erreur est survenue. Veuillez rééssayer plus tard', Toast.LONG)

    }


    // But, be SURE to return the rejected promise, so the caller still has
    // the option of additional specialized handling at the call-site:$

    return Promise.reject(error);
});
const Api = axios
export default Api;