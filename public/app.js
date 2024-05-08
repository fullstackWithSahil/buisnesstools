"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
app.use((0, cors_1.default)({
    origin: process.env.NEXT_PUBLIC_HOST,
    credentials: true,
}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_HOST);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
mongoose_1.default.connect(process.env.MONGODB_URL);
//auth imports
const Auth_1 = __importDefault(require("./routes/Auth"));
const googleAuthhandler_1 = require("./auth/googleAuthhandler");
const user_route_1 = __importDefault(require("./routes/user.route"));
const Chats_route_1 = __importDefault(require("./routes/Chats.route"));
const email_routes_1 = __importDefault(require("./routes/email.routes"));
const protect_1 = require("./middleware/protect");
const feedback_1 = require("./routes/feedback");
app.get('/', (req, res) => {
    res.send('<h1>backend for buisnesstools</h1>');
});
app.use("/api/auth", Auth_1.default);
app.get("/api/sessions/oauth/google", googleAuthhandler_1.googleAuthhandler);
app.use("/api/users", user_route_1.default);
app.use("/api/teams", Chats_route_1.default);
app.post("/api/feedback", protect_1.protectRoute, feedback_1.feedback);
app.use("/api/emails/audience", email_routes_1.default);
app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`));
//# sourceMappingURL=app.js.map