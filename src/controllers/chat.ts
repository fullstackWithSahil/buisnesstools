import { Request,Response } from "express";
import User from "../modles/Users";
import Chat from "../modles/Chat";

export async function createTeam(req: Request, res: Response){
    const { team, members } = req.body;
    const admin = req.body.user._id;
    try {
        const userIds = await Promise.all(members.map(async (member: string) => {
            try {
                const user = await User.findOne({ email: member });
                if (user) {
                    return user._id;
                } else {
                    throw new Error(`User with email ${member} not found`);
                }
            } catch (error) {
                console.error(`Error finding user: ${error.message}`);
                throw error; // Propagate the error further
            }
        }));

        const newChat = new Chat({
            chatName:team,
            isGroupChat:true,
            members:userIds,
            groupAdmin:admin
        })

        await newChat.save();
        res.json(newChat);
    } catch (error) {
        console.log("error in creating team",error);
        res.json(error);
    }
}


export async function getMessages(req:Request,res:Response){
    try {
        
    } catch (error) {
        console.log("error in getting messages",error);
        res.json(error);
    }
}