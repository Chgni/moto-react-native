import axios from "axios";
import Api from "./Api";
import Route from "../models/Route";

export default class RouteService {
    #api = Api
    async getRoutes(owned, joined) {
        const response = await this.#api.get(`/routes?owned=${owned}&joined=${joined}`)
        const routesData = response.data;
        const routes = routesData.map(route => {
            return new Route(
                route.id,
                route.name,
                route.description,
                route.owner_id,
                route.owner,
                route.members,
                route.waypoints
            );
        });
        return routes;
    }
    async getRouteById(id) {
        const response = await this.#api.get(`/routes/${id}`);
        let route = response.data;
        let data = []
        //c'est requis pour l'affichage de la carte
        for (const waypoint of route.waypoints) {
            waypoint.latitude = parseFloat(waypoint.latitude);
            waypoint.longitude = parseFloat(waypoint.longitude);
            data.push(waypoint)
        }
        route.waypoints = data
        return route;
    };
    async addMember(route_id, member_to_add_id) {
        await this.#api.post(`/routes/${route_id}/members`, {
            id: member_to_add_id
        });
    }
    async update(route)  {

        await this.#api.put(`/routes/${route.id}/waypoints/`,
            route.waypoints
        )
    }
}
const getTripsOwned = async (user, token) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/${process.env.API_VERSION}/routes?owned=true&joined=false`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if( error.response ){
            // console.log(error.response.data); // => the response payload
            console.log(error.response.data);
        }
    }
};
const getTripsJoined = async (user, token) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/${process.env.API_VERSION}/routes?owned=false&joined=true`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if( error.response ){
            // console.log(error.response.data); // => the response payload
        }
    }
};

const getTripById = async (id, user, token) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/${process.env.API_VERSION}/routes/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if( error.response ){
            // console.log(error.response.data); // => the response payload
        }
    }
};


const createTrip = async (name, description, token, steps) => {
    const filteredSteps = [];
    for (let step of steps) {
        const filtered = {latitude: parseFloat(step.latitude.toFixed(5)),
            longitude: parseFloat(step.longitude.toFixed(5)), order: step.order, name: "step"};
        filteredSteps.push(filtered);
    }
        try {
            const response = await axios.post(`${process.env.API_URL}/${process.env.API_VERSION}/routes/`, {
                name: name,
                description: description,
                waypoints: filteredSteps
            }, {headers: {
                    Authorization: `Bearer ${token}`
                }});

            if (response.status === 422) {
                alert('Erreur de champs');
            }

            if (response.status === 500) {
                alert('Erreur de base de données');
            }

            if (response.status === 201) {
                return response.data;
                //OK, create snack bar ?
            }
        } catch (error) {
            if( error.response ){
                console.log(error.response.data); // => the response payload
            }
        }

};

const updateTrip = async (route_id, steps, token) => {
    const filteredSteps = [];
    for (let step of steps) {
        const filtered = {latitude: parseFloat(step.latitude.toFixed(5)),
            longitude: parseFloat(step.longitude.toFixed(5)), order: step.order, name: "step"};
        filteredSteps.push(filtered);
    }
    try {
        const response = await axios.put(`${process.env.API_URL}/${process.env.API_VERSION}/routes/${route_id}/waypoints/`,
            filteredSteps
        , {headers: {
                Authorization: `Bearer ${token}`
            }});

        if (response.status === 404) {
            alert('Impossible de faire la mise a jour.');
        }

        if (response.status === 500) {
            alert('Erreur de base de données');
        }

        if (response.status === 200) {
            return response;
        }
    } catch (error) {
        if( error.response ){
        }
    }

};

export {createTrip, getTripsOwned, getTripById, updateTrip, getTripsJoined};
