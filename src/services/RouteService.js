import axios from "axios";
import Api from "./Api";
import RouteModel from "../models/RouteModel";

export default class RouteService {
    #api = Api
    async getRoutes(owned, joined) {
        const response = await this.#api.get(`/routes?owned=${owned}&joined=${joined}`)
        const routesData = response.data;
        const routes = routesData.map(route => {
            return new RouteModel(
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
    async create(name, waypoints) {
        const response = await this.#api.post('/routes', {
            name: name,
            waypoints: waypoints
        })
        return response.data
    }
}

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



export {createTrip};
