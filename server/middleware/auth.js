const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const config = require("../utils/config");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");


//Protect Middleware
//This middleware ensures that only authenticated users can access protected routes.
const protect = asyncErrorHandler(async (req, res, next) => {
    let token;

    // Check if there is an authorization header and if it starts with "Bearer".
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        // Extract the JWT token from the authorization header.
        token = req.headers.authorization.split(" ")[1]
    }

    // Check if a token is provided in cookies.
     else if(req.cookies.token){
        token = req.cookies.token
     }

    // Ensure that a token is provided.
    if(!token){
        return next(new ErrorResponse("Not authorized to access this route", 401))
    }

    try{
        // Verify the token using JWT.verify method which will decode it.
        // If token is invalid/not formed correctly, it will throw an error.
        const decoded = jwt.verify(token, config.jwt_secret)

        // Log the decoded token data to console. (Useful for debugging purposes)
        console.log(decoded)

        // Find user with ID obtained from decoded token and attach user object to the request object.
        req.user = await User.findById(decoded.id)

        // Proceed to the next middleware or route handler.
        next()
    } catch(err){
        // Handle any errors that occur during token verification or user fetching.
        return next(new ErrorResponse("Not authorized to access this route", 401))
    }
});


// The 'authorize' function takes any number of roles as arguments.
// 'roles' will be an array containing all provided role strings.
const authorize = (...roles) => {
    // Return middleware function.
    return (req, res, next) => {
        // Check if the user's role is NOT one of the allowed roles.
        if(!roles.includes(req.user.role)){
            // If not authorized, return an error response indicating lack of permissions.
            return next(new ErrorResponse(`${req.user.role} role is not authorized to access this route`, 403))
        }
        // Proceed to the next middleware or route handler.
        next()
    }
}


module.exports = {protect, authorize}