import { Request,Response } from "express";
import User from "../modles/Users";
import Chat from "../modles/Chat";

export async function createTeam(req: Request, res: Response){
    try {
        const {members,team,user} = req.body;
        const admin= user._id;

        //chech if team already exists
        const teamTocreateArray =await Chat.find({chatName:team});
        const teamTocreate = teamTocreateArray.find(team=>team.groupAdmin==user._id);
        
        if(teamTocreate){
            res.json({message:"Team already exists"});
            return;
        }

        const membersId = members.map((member) =>{
            return new Promise(async(resolve, reject) =>{
                try {
                    const data = await User.findOne({email: member}).select("_id");
                    resolve(data._id);
                } catch (error) {
                    reject(error);
                }
            })
        });
        let userIds = await Promise.all(membersId);

        const newChat = new Chat({
            chatName:team,
            isGroupChat:true,
            members:[
                ...userIds,
                admin
            ],
            groupAdmin:admin
        })

        await newChat.save()

        res.json(newChat)
    } catch (error) {
        console.log("error creating team", error);
        res.json({ error: error});
    }
}


export async function addMembers(req: Request, res: Response) {
    try {
        const { team, email } = req.body;

        // Find the user ID of the member to be added
        const addedMember = await User.findOne({ email }).select("_id");
        if (!addedMember) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find the chat based on team
        const chat = await Chat.findOne({ chatName: team });
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        // Check if the member is already in the chat
        if (chat.members.includes(addedMember._id)) {
            return res.status(400).json({ error: "Member already exists in the chat" });
        }

        // Add the member to the chat
        chat.members.push(addedMember._id);
        await chat.save();

        res.json({ message: "Member added successfully", chat });
    } catch (error) {
        console.log("Error adding members to team", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function removeMember(req: Request, res: Response) {
    try {
        const { team, email } = req.body;

        // Find the user ID of the member to be removed
        const removedMember = await User.findOne({ email }).select("_id");
        if (!removedMember) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find the chat based on team
        const chat = await Chat.findOne({ chatName: team });
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        // Check if the member exists in the chat
        const memberIndex = chat.members.indexOf(removedMember._id);
        if (memberIndex === -1) {
            return res.status(400).json({ error: "Member not found in the chat" });
        }

        // Remove the member from the chat
        chat.members.splice(memberIndex, 1);
        await chat.save();

        res.json({ message: "Member removed successfully", chat });
    } catch (error) {
        console.log("Error removing member from team", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function deleteTeam(req: Request, res: Response){
    try {
        const {team,user} = req.body;
        //finding the correct team
        const teamToDeleteArray =await Chat.find({chatName:team});
        const teamToDelete = teamToDeleteArray.find(team=>team.groupAdmin==user._id);
        
        if(!teamToDeleteArray|| !teamToDelete){
            res.json({message:"Team not found"});
            return;
        }
        await Chat.findByIdAndDelete(teamToDelete._id);
        res.status(200).json({message:"Team deleted successfully"});
    } catch (error) {
        console.log("Error deleting team", error);
        res.status(500).json({ error: "Internal server error"});
    }
}

export async function getChats(req: Request, res: Response) {
    try {
        const { user } = req.body; // Assuming user contains the ID of the user
        const chats = await Chat.find({ members: user }).populate('members');
        res.json(chats);
    } catch (error) {
        console.log("Error getting chats:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}