class ValidationError extends Error {
    constructor(status, message) {
        super()
        this.status = status
        this.name = 'ValidationError'
        this.message = message
    }
}

class AuthorizationError extends Error {
    constructor(status, message) {
        super()
        this.status = status
        this.name = 'AuthorizationError'
        this.message = message
    }
}

class InternalServerError extends Error {
    constructor(status, message) {
        super()
        this.status = status
        this.name = 'InternalServerError'
        this.message = message
    }
}

class ClientError extends Error {
    constructor(status, message) {
        super()
        this.status = status
        this.name = 'ClientError'
        this.message = message
    }
}

module.exports = {
    ValidationError,
    AuthorizationError,
    InternalServerError,
    ClientError
}