"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = void 0;
const Users_1 = __importDefault(require("../modles/Users"));
async function findUser(req, res) {
    try {
        const email = req.params.email;
        const data = await Users_1.default.find({ email: { $regex: new RegExp(email, 'i') } }).select("-password");
        res.json(data);
    }
    catch (error) {
        console.log("error finding users", error);
    }
}
exports.findUser = findUser;
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
//# sourceMappingURL=users.js.map