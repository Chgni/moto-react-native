export default class Friend {
    id;
    status;
    requesting_user_id;
    target_user_id;
    requesting_user;
    target_user;

    constructor(id, status, requesting_user_id, target_user_id, requesting_user, target_user) {
        this.id = id;
        this.status = status;
        this.requesting_user_id = requesting_user_id;
        this.target_user_id = target_user_id;
        this.requesting_user = requesting_user;
        this.target_user = target_user;
    }
}

export const FriendsStatus = Object.freeze({
    PENDING: 0,
    ACCEPTED: 1,
    DENIED: 2,
    REMOVED: 3
})
