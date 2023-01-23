import {StatusCodes} from 'http-status-codes'
import BadRequestError from './bad-request.js';

class UnauthenticatedError extends BadRequestError{
    constructor(message){
        super(message)
        this.statusCode=StatusCodes.UNAUTHORIZED
    }
}

export default UnauthenticatedError