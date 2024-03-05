export default class RouteModel {
    id;
    name;
    description;
    owner_id;
    owner;
    members;
    waypoints;

    constructor(id, name, description, owner_id, owner, members, waypoints) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.owner_id = owner_id;
        this.owner = owner;
        this.members = members;
        this.waypoints = waypoints;
    }
}