const asyncHandler = require("../middleware/asyncErrorHandler");
const ErrorResponse = require("../utils/errorResponse");
const cookieParser = require("cookie-parser");
const config = require("../utils/config");
const User = require("../models/User");


// Desc: Register user
// @route POST /api/v1/auth/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
    // Destructuring assignment to extract fields from the request body.
    const {name,email,password,role} = req.body 

    // Create a new user with the provided details.
    // This involves saving the user details to the database.
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // Utilize a helper function to send a token response to the user.
    // This involves generating a JWT token, setting it in a cookie, and sending it to the client.
    sendTokenResponse(user, 200, res)
})


// Desc: Login user
// @route POST /api/v1/auth/login
// @access Public

exports.login = asyncHandler(async (req,res,next) => {
    const {email,password} = req.body 

    // Validate that both email and password are provided in the request.
    if(!email || !password){
        return next(new ErrorResponse("Please provide an email and password", 400))
    }

    // Check for a user with the provided email and retrieve their password for comparison.
    const user = await User.findOne({email}).select("+password")

    // If no user is found, send an error response.
    if(!user) return next(new ErrorResponse("Invalid credentials", 401))

    // Validate if the provided password matches the user's password.
    const isMatch = await user.matchPassword(password)

    // If the password does not match, send an error response.
    if(!isMatch) return next(new ErrorResponse("Invalid credentials", 401))

    // Upon successful validation, send a token response to the client.
    sendTokenResponse(user, 200, res)
})



// Desc: Get current logged in user
// @route POST /api/v1/auth/me
// @access Private

exports.getMe = asyncHandler(async (req,res,next) => {
    // Retrieve user data from the database using the user ID obtained from the request object.
    // This ID was populated by the middleware validating the JWT token.
    const user = await User.findById(req.user.id)

    // Send a response containing:
    // - HTTP Status Code: 200 OK
    // - JSON body containing: success flag and user data
    res.status(200).json({success: true, data: user})
})


// Desc: Forgot password
// @route POST /api/v1/auth/forgotpassword
// @access Public

exports.forgotPassword = asyncHandler(async (req,res,next) => {

    const user = await User.findOne({email: req.body.email})

    if(!user) return next(new ErrorResponse("There is no user with that email", 404))

    // Get reset token
    const resetToken = user.getResetPasswordToken()

    await user.save({validateBeforeSave: false})

    res.status(200).json({success: true, data: user})
})



//Get toke from model, create cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
    // Generate a JWT token using a method from the User model.
    const token = user.getSignedJwtToken()

    // Options for the cookie that will store the JWT token.
    const options = {
        // Set the expiration date for the cookie.
        expires: new Date(Date.now() + config.jwt_cookie_expire * 24 * 60 * 60 * 1000),
        httpOnly: true // The cookie is only accessible by the web server
    }

    // Set cookie secure flag to true when in production environment, making sure cookie is sent over HTTPS.
    if(config.node_env === "production"){
        options.secure = true 
    }

    // Send response to client which includes:
    // - HTTP Status Code
    // - Cookie containing JWT token
    // - JSON body containing success flag and JWT token
    res
    .status(statusCode)
    .cookie('token', token, options) // Set cookie in response
    .json({ success: true, token });
}