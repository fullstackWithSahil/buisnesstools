"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscribers = exports.getAudience = exports.addAudience = void 0;
const Subscribers_1 = __importDefault(require("../../modles/Subscribers"));
async function addAudience(req, res) {
    try {
        const { email, user } = req.body;
        //ckeck if user is already exists
        const existingAudience = await Subscribers_1.default.find({ email: email, subscribedTo: user._id });
        if (existingAudience[0]) {
            res.json({
                title: "email already exists",
                description: "this user has already subscribed to your newsletter",
            });
            return;
        }
        //add new subscriber
        const newSubscribers = new Subscribers_1.default({
            email: email,
            subscribedTo: user._id
        });
        await newSubscribers.save();
        res.json({
            title: "email subscribed",
            description: "this email was successfully subscribed to your newsletter",
            data: newSubscribers
        });
    }
    catch (error) {
        console.log("Error adding audience");
        res.json({
            title: "Error adding audience",
            description: "Error adding audience try again later",
        });
    }
}
exports.addAudience = addAudience;
async function getAudience(req, res) {
    try {
        const { user } = req.body;
        const audience = await Subscribers_1.default.find({ subscribedTo: user._id });
        res.json(audience);
    }
    catch (error) {
        console.log("Error getting audience", error);
    }
}
exports.getAudience = getAudience;
async function deleteSubscribers(req, res) {
    try {
        const data = req.body;
        const promises = data.map(sub => {
            return new Promise(async (resolve, reject) => {
                try {
                    const deletedsubscribers = await Subscribers_1.default.findByIdAndDelete(sub._id);
                    resolve(deletedsubscribers);
                }
                catch (error) {
                    reject(error);
                }
            });
        });
        Promise.all(promises).then((data) => {
            res.json({
                title: 'Delete Subscribers',
                description: "Deleted Subscribers successfully"
            });
        }).catch((err) => {
            res.json({
                title: "something went wrong",
                description: "something went wrong try again later"
            });
            console.log(err);
        });
    }
    catch (error) {
        console.log("Error deleting subscribers", error);
    }
}
exports.deleteSubscribers = deleteSubscribers;
//# sourceMappingURL=audience.controller.js.map