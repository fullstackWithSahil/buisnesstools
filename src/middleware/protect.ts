import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../modles/Users"

export async function protectRoute(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['auth-token'];
    if (!token) {
        return res.send("You must be logged in to access this page");
    }

    try {
        const user: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userData = await User.findById(user.newUser._id);

        if (!userData) {
            return res.send("User not found");
        }

        // Attach user data to the request for further processing
        req.body.user = userData;

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error("Error in authentication middleware:", error);
        return res.status(403).send("Invalid or expired token");
    }
}
