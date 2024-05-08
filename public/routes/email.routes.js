"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const audience_controller_1 = require("../controllers/emailnewsletter/audience.controller");
const protect_1 = require("../middleware/protect");
const router = express_1.default.Router();
router.get("/", protect_1.protectRoute, audience_controller_1.getAudience);
router.post("/add", protect_1.protectRoute, audience_controller_1.addAudience);
router.delete("/delete", audience_controller_1.deleteSubscribers);
exports.default = router;
//# sourceMappingURL=email.routes.js.map