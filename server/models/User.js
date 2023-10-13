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


// Encrypt password using bcrypt
UserSchema.pre('save', async function(next){
    //Generate a salt
    const salt = await bcrypt.genSalt(10)
    //hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt)
}
)

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id: this._id}, config.jwt_secret, {
        expiresIn: config.jwt_expire
    })
}

UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}


module.exports = mongoose.model("User", UserSchema);