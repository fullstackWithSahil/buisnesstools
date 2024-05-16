import { Request,Response } from "express";
import User from "../modles/Users";
import {uploadImageToS3,getImageFromS3, getObject} from "../utils/S3"


export async function findUser(req:Request,res:Response){
    try {
        const email = req.params.email;
        const data = await User.find({ email:{$regex: new RegExp(email,'i')}}).select("-password")
        res.json(data);
    } catch (error) {
        console.log("error finding users",error);
    }
}

export async function Settings(req:Request,res:Response){
    try {
        // const image = req.file;
        // const {firstName,lastName,user}=req.body
        // console.log(user._id)
        
        // if (image){
        //     await uploadImageToS3({
        //         key:`${user.email}Profile`,
        //         imageData:image.buffer,
        //         type:image.mimetype
        //     })
        //     res.send("image found")
        // }
        // const data = await getImageFromS3("tanay@gmail.comProfile")
        const data =await getObject("newsletter.png");
        console.log(data)
        res.send(data);
    } catch (error) {
        console.log("error changing settings",error);
        res.json({
            title:"something went wrong",
            description:"Something went wrong try again later",
        })
    }
}