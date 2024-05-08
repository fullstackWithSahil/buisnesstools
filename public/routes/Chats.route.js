"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const protect_1 = require("../middleware/protect");
const chat_controller_1 = require("../controllers/chat.controller");
router.post("/createteam", protect_1.protectRoute, chat_controller_1.createTeam);
router.put("/addMembers", protect_1.protectRoute, chat_controller_1.addMembers);
router.delete("/removeMembers", protect_1.protectRoute, chat_controller_1.removeMember);
router.delete("/deleteTeam", protect_1.protectRoute, chat_controller_1.deleteTeam);
router.get("/getChats", protect_1.protectRoute, chat_controller_1.getChats);
router.get("/getmessages/:id", protect_1.protectRoute, chat_controller_1.getMessages);
router.post("/sendMessage/:id", protect_1.protectRoute, chat_controller_1.sendMessage);
exports.default = router;
//# sourceMappingURL=Chats.route.js.map