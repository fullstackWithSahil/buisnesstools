import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    content:{type:String,trime:true},
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"chat"
    }
},{
    timestamps:true
})

const Message = mongoose.model("message", messageModel);

export default Message;