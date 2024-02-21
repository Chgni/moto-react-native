export class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "Unauthorized"
        this.message = "The request is not authorized"
    }
}