"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SubscribersSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    subscribedTo: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
    },
    status: { type: String, required: true, default: "subscribed" },
    subscribedAt: { type: Date, required: true, default: Date.now() },
});
const Subscribers = mongoose_1.default.models.subscribers ||
    mongoose_1.default.model("subscribers", SubscribersSchema);
exports.default = Subscribers;
//# sourceMappingURL=Subscribers.js.map