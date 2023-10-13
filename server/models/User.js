const mongoose = require("mongoose");
const config = require("../utils/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please add a name"]
    },
    email:{
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        match: [
            // eslint-disable-next-line no-useless-escape
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
            "Please add a valid email"
        ]
    },
    role:{
        type: String,
        enum: ["user", "publisher"],
        default: "user"
    },
    password:{
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt:{
        type: Date,
        default: Date.now
    },
    
});


// Define a pre-save middleware function for the UserSchema in Mongoose.
// 'pre('save')' means that this function will run before the document is saved.
UserSchema.pre('save', async function(next){
    // Generate a "salt" using bcrypt. 
    // A salt is random data that is used as an additional input to a hash function.
    // The '10' here determines how computationally intensive the salt generation is.
    const salt = await bcrypt.genSalt(10)

    // Hash (encrypt) the user's password with the generated salt using bcrypt.
    // This ensures that even if data is breached, the actual passwords are not visible in plain text.
    // The 'this' keyword refers to the current document about to be saved - the user instance.
    this.password = await bcrypt.hash(this.password, salt)

    // Call the next middleware function in the stack.
    next();
}
)

// Sign JWT and return
// Define a method on the UserSchema.methods object.
// This method will be available on all instances of the User model.
UserSchema.methods.getSignedJwtToken = function(){
    // Sign a JSON Web Token (JWT) and return it.
    // The JWT contains the user ID (this._id) in its payload.
    // 'config.jwt_secret' is the secret key used to sign the token.
    // 'expiresIn' sets the token to expire in an amount of time defined in 'config.jwt_expire'.
    return jwt.sign({id: this._id}, config.jwt_secret, {
        expiresIn: config.jwt_expire
    })
}

// Define another method for the UserSchema instances to check if entered password is correct.
UserSchema.methods.matchPassword = async function(enteredPassword){
    // Compare the entered password with the hashed password in the database.
    // 'bcrypt.compare()' will return a boolean indicating whether the entered password,
    // when hashed, matches the stored hash ('this.password').
    // 'this.password' refers to the hashed password related to the instance the method is called on.
    return await bcrypt.compare(enteredPassword, this.password)
}



module.exports = mongoose.model("User", UserSchema);