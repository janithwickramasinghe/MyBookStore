const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type:String, //dataType
        required:true, //validate
    },
    lastName:{
        type:String, //dataType
        required:true, //validate
    },
    phone:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    dob:{
        type:Date,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    password:{
        type:String, 
        required:true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    verificationToken: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }
});

module.exports = mongoose.model(
    "users", //file Name
    userSchema // function Name
)