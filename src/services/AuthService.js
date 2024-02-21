import api from "./Api";
import Api from "./Api";
import qs from 'qs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UnauthorizedError} from "../errors/ApiCallError";
import JwtService from "./JwtService";
import JwtResponse from "../types/JwtResponse";
import axios from "axios";
import User from "../models/User";

export default class AuthService {
    #api = Api
    #jwtService = new JwtService()
    async login(email, password) {
        const response = await this.#api.post('/auth/signin', qs.stringify({
            username: email,
            password: password,
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        console.log('yo')
        if (response.status === 200) {
            return response.data
        }
    }

    async getMe() {
        const response = await this.#api.get('/auth/me')
        const { id, username, email, role, is_active } = response.data;
        if (id == null || username == null || email == null || role == null || is_active == null) {
            throw new UnauthorizedError();
        }
        return new User(id, username, email, role, is_active);
    }

    async disconnect() {
        await this.#jwtService.removeJwt()
    }

    async create(username, email, password){
        let response = await this.#api.post('/auth/signup', {
            username: username,
            email: email,
            password: password
        });
        const { id, username_, email_, role, is_active } = response.data;
        return new User(id, username_, email_, role, is_active);

    }
}