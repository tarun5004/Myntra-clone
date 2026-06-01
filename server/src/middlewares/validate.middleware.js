import {validationResult} from 'express-validator';
import ApiError from '../utils/ApiError.js';

const validate = (req, res, next) => {
    const errors = validationResult(req);   //it checks the request has any validation errors based on the rules defined 
    // in the route handlers. it returns an object containing the validation errors, if any.

    if (errors.isEmpty()) {
        return next();
    }
    
    // if there are any validations errors convert into a format that can be esily sent in the response.
    const extractedErrors = errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
    }));

    return next(new ApiError(400, "Validation error", extractedErrors));
};
export default validate;


// express validator is used to run validation rules defined in the route handlers. but this process is manually 
// so we impoeted validation result forom express validtaion import { validationResult } from "express-validator";
// validationResult se errors nikalo → empty hai to next → errors hain to clean format banao → ApiError ke through error middleware ko bhejo.