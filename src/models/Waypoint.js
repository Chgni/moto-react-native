export default class Waypoint {
    id;
    latitude;
    longitude;
    name;
    order;
    router_id;
    route;

    constructor(id, latitude, longitude, name, order, router_id, route) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.order = order;
        this.router_id = router_id;
        this.route = route;
    }
}