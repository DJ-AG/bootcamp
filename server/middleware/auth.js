const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const config = require("../utils/config");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");


// Protect routes
const protect = asyncErrorHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        // Set token from Bearer token in header
        token = req.headers.authorization.split(" ")[1]
    }

    // Set token from cookie
    // else if(req.cookies.token){
    //     token = req.cookies.token
    // }

    // Make sure token exists
    if(!token){
        return next(new ErrorResponse("Not authorized to access this route", 401))
    }

    try{
        // Verify token
        const decoded = jwt.verify(token, config.jwt_secret)

        console.log(decoded)

        req.user = await User.findById(decoded.id)

        next()
    } catch(err){
        return next(new ErrorResponse("Not authorized to access this route", 401))
    }

});


// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`${req.user.role} role is not authorized to access this route`, 403))
        }
        next()
    }
}


module.exports = {protect, authorize}