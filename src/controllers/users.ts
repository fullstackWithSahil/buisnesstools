import { Request,Response } from "express";
import User from "../modles/Users";


export async function findUser(req:Request,res:Response){
    const email = req.params.email;
    const data = await User.find({ email:{$regex: new RegExp(email,'i')}})
    res.json(data);
}


// try {
//     const userIds = await Promise.all(members.map(async (member: string) => {
//         try {
//             const user = await User.findOne({ email: member });
//             if (user) {
//                 return user._id;
//             } else {

//                 throw new Error(`User with email ${member} not found`);
//             }
//         } catch (error) {
//             console.error(`Error finding user: ${error.message}`);
//             throw error; // Propagate the error further
//         }
//     }));

//     const chat = new Chat({
//         chatName: team,
//         members: userIds,
//     });

//     await chat.save();

//     // Respond with success message or the created chat data
//     return res.status(201).json({ message: 'Team created successfully' });
// } catch (error) {
//     // Handle any errors that occur during team creation or user lookup
//     return res.status(500).json({ message: 'Internal server error', error: error.message });
// }