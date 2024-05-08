"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessages = exports.getChats = exports.deleteTeam = exports.removeMember = exports.addMembers = exports.createTeam = void 0;
const Users_1 = __importDefault(require("../modles/Users"));
const Chat_1 = __importDefault(require("../modles/Chat"));
const Message_1 = __importDefault(require("../modles/Message"));
async function createTeam(req, res) {
    try {
        const { members, team, user } = req.body;
        const admin = user._id;
        //chech if team already exists
        const teamTocreateArray = await Chat_1.default.find({ chatName: team });
        const teamTocreate = teamTocreateArray.find((team) => team.groupAdmin == user._id);
        if (teamTocreate) {
            res.json({ message: "Team already exists" });
            return;
        }
        const membersId = members.map((member) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await Users_1.default.findOne({ email: member }).select("_id");
                    resolve(data._id);
                }
                catch (error) {
                    reject(error);
                }
            });
        });
        let userIds = await Promise.all(membersId);
        const newChat = new Chat_1.default({
            chatName: team,
            isGroupChat: true,
            members: [...userIds, admin],
            groupAdmin: admin,
        });
        await newChat.save();
        res.json(newChat);
    }
    catch (error) {
        console.log("error creating team", error);
        res.json({ error: error });
    }
}
exports.createTeam = createTeam;
async function addMembers(req, res) {
    try {
        const { team, email } = req.body;
        // Find the user ID of the member to be added
        const addedMember = await Users_1.default.findOne({ email }).select("_id");
        if (!addedMember) {
            return res.status(404).json({ error: "User not found" });
        }
        // Find the chat based on team
        const chat = await Chat_1.default.findOne({ chatName: team });
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        // Check if the member is already in the chat
        if (chat.members.includes(addedMember._id)) {
            return res
                .status(400)
                .json({ error: "Member already exists in the chat" });
        }
        // Add the member to the chat
        chat.members.push(addedMember._id);
        await chat.save();
        res.json({ message: "Member added successfully", chat });
    }
    catch (error) {
        console.log("Error adding members to team", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.addMembers = addMembers;
async function removeMember(req, res) {
    try {
        const { team, email } = req.body;
        // Find the user ID of the member to be removed
        const removedMember = await Users_1.default.findOne({ email }).select("_id");
        if (!removedMember) {
            return res.status(404).json({ error: "User not found" });
        }
        // Find the chat based on team
        const chat = await Chat_1.default.findOne({ chatName: team });
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
    }
    catch (error) {
        console.log("Error removing member from team", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.removeMember = removeMember;
async function deleteTeam(req, res) {
    try {
        const { team, user } = req.body;
        //finding the correct team
        const teamToDeleteArray = await Chat_1.default.find({ chatName: team });
        const teamToDelete = teamToDeleteArray.find((team) => team.groupAdmin == user._id);
        if (!teamToDeleteArray || !teamToDelete) {
            res.json({ message: "Team not found" });
            return;
        }
        await Chat_1.default.findByIdAndDelete(teamToDelete._id);
        res.status(200).json({ message: "Team deleted successfully" });
    }
    catch (error) {
        console.log("Error deleting team", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
exports.deleteTeam = deleteTeam;
async function getChats(req, res) {
    try {
        const { user } = req.body; // Assuming user contains the ID of the user
        const chats = await Chat_1.default.find({ members: user }).populate("members");
        res.json(chats);
    }
    catch (error) {
        console.log("Error getting chats:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}
exports.getChats = getChats;
async function getMessages(req, res) {
    try {
        const { id } = req.params;
        //get date 10 days ago
        let tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        //get messages from 10 days ago and for a perticular chat
        const messages = await Message_1.default.find({
            chat: id,
            createdAt: { $gte: tenDaysAgo }, // Filter messages created after tenDaysAgo
        }).populate("sender");
        res.json(messages);
    }
    catch (error) {
        console.log("Error getting chats:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}
exports.getMessages = getMessages;
async function sendMessage(req, res) {
    try {
        const { id } = req.params;
        const { content, user } = req.body;
        const newMessage = new Message_1.default({
            content,
            sender: user._id,
            chat: id,
        });
        await newMessage.save();
        const data = await newMessage.populate("sender");
        res.json(data);
    }
    catch (error) {
        console.log("error sending message:", error);
        res.status(500).json({ error: "something went wrong" });
    }
}
exports.sendMessage = sendMessage;
//# sourceMappingURL=chat.controller.js.map