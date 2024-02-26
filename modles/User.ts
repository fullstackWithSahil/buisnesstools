import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:String,
    middlename:String,
    lastname:String,
    email:String,
});

export const User = mongoose.model('users', UserSchema);