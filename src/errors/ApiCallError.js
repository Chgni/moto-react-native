export class UnauthorizedError extends Error {
    constructor() {
        super();
        this.name = "Unauthorized"
        this.message = "The request is not authorized"
    }
}

export class UnprocessableEntityError extends Error {
    details;
    constructor()    {
        super();
        this.name = "UnprocessableEntity"
        this.message = "The entity is not valid"
    }
}