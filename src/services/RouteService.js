import axios from "axios";
import Api from "./Api";
import RouteModel from "../models/RouteModel";

export default class RouteService {
    #api = Api
    async getRoutes(owned, joined) {
        const response = await this.#api.get(`/routes/?owned=${owned}&joined=${joined}`)
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
    async removeMember(routeId, memberId) {
        await this.#api.delete(`/routes/${routeId}/members`, {
            data:  {
                id: memberId
            }
        })
    }
    async addMember(route_id, member_to_add_id) {
        await this.#api.post(`/routes/${route_id}/members/`, {
            id: member_to_add_id
        });
    }
    async update(route)  {

        await this.#api.put(`/routes/${route.id}/waypoints/`,
            route.waypoints
        )
    }
    async delete(route)  {
        await this.#api.delete(`/routes/${route.id}/`,
            route.waypoints
        )
    }
    async updateDate(route, date)  {

        await this.#api.put(`/routes/${route.id}`, {
            date: date
            }
        )
    }

    async updateRight(route, member)  {
        await this.#api.put(`/routes/${route.id}/update_edition`, {
                user_id : member.id,
                edition : member.edition ? false : true
            }
        )
    }

    async patch(route, distance, duration)  {

        await this.#api.patch(`/routes/${route.id}/`, {
                distance: distance,
                time: duration
            }
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