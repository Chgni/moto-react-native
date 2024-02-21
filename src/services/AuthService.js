import api from "./Api";
import Api from "./Api";
import qs from 'qs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UnauthorizedError} from "../errors/ApiCallError";
import JwtService from "./JwtService";
import JwtResponse from "../types/JwtResponse";

export default class AuthService {
    #api = Api
    async login(email, password) {
        const response = await this.#api.post('http://192.168.8.92:8000/api/v0.1/auth/signin', qs.stringify({
            username: email,
            password: password,
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        if (response.status === 200) {
            return response.data
        }
    }
}