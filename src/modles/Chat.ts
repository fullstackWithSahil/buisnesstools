import mongoose from "mongoose";

const chatModle = new mongoose.Schema({
    chatName: { type:String,trim:true},
    isGroupChat:{type:Boolean,default:false},
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"users"
        }
    ],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"message",
        required:false
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    picture:{
        type:String,
    }
},{
    timestamps:true,
});

const Chat = mongoose.models.chat || mongoose.model("chat",chatModle);

export default Chat;