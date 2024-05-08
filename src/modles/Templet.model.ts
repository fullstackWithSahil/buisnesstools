import mongoose from "mongoose";

const templeteSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    logo:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    website:{
        type:String,
        required:false,
    },
    templeteName:{
        type:String,
        required:true,
        default:"Simple-templete"
    },
    link:String
})

const Templet = mongoose.model("Templete", templeteSchema)

export default Templet