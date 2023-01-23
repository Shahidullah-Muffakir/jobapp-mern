import {StatusCodes} from 'http-status-codes'
import BadRequestError from './bad-request.js';

class NotFoundError extends BadRequestError{
    constructor(message){
        super(message)
        this.statusCode=StatusCodes.NOT_FOUND
    }
}

export default NotFoundError