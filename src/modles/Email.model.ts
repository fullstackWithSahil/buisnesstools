import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
    title:String,
    content:String,
    Owner:String,
},{
    timestamps:true
});

const Email = mongoose.model('Email',emailSchema);

export default Email;