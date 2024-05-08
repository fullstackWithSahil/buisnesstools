import { Request,Response } from "express";
import Subscribers from "../../modles/Subscribers";

export async function addAudience(req: Request, res: Response){
    try {
        const {email,user} = req.body;

        //ckeck if user is already exists
        const existingAudience = await Subscribers.find({email: email,subscribedTo:user._id});

        if (existingAudience[0]){
            res.json({
                title:"email already exists",
                description:"this user has already subscribed to your newsletter",
            })
            return;
        }

        //add new subscriber
        const newSubscribers = new Subscribers({
            email: email,
            subscribedTo:user._id
        })
        await newSubscribers.save();

        res.json({
            title:"email subscribed",
            description:"this email was successfully subscribed to your newsletter",
            data: newSubscribers
        })
    } catch (error) {
        console.log("Error adding audience")
        res.json({
            title: "Error adding audience",
            description:"Error adding audience try again later", 
        })
    }
}

export async function getAudience(req: Request, res: Response){
    try {
        const { user } = req.body;
        const audience = await Subscribers.find({ subscribedTo: user._id });

        res.json(audience);
    } catch (error) {
        console.log("Error getting audience",error)
    }
}

export async function deleteSubscribers(req: Request, res: Response){
    try {
        const data = req.body;
        const promises= data.map(sub=>{
            return new Promise(async(resolve,reject) => {
                try {
                    const deletedsubscribers = await Subscribers.findByIdAndDelete(sub._id);
                    resolve(deletedsubscribers)
                } catch (error) {
                    reject(error)
                }
            })
        })
        Promise.all(promises).then((data)=>{
            res.json({
                title: 'Delete Subscribers',
                description:"Deleted Subscribers successfully"
            })
        }).catch((err) =>{
            res.json({
                title:"something went wrong",
                description:"something went wrong try again later"
            })
            console.log(err)
        });
    } catch (error) {
        console.log("Error deleting subscribers",error)
    }
}