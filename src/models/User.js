export default class User {
    id;
    username;
    email;
    role;
    is_active;

    constructor(id, username, email, role, is_active) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.is_active = is_active;
    }
}