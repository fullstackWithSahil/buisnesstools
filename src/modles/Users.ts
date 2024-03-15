import mongoose, { Document } from 'mongoose';

interface UserDocument extends Document {
    username: string;
    middlename: string;
    lastname: string;
    email: string;
    password: string;
    forgotPasswordToken?: string;
    forgotPasswordExpiry?: Date;
    verifToken?: string;
    verifTokenExpiry?: Date;
}

const Userschema = new mongoose.Schema<UserDocument>({
    username: { type: String, required: true },
    middlename: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    verifToken: String,
    verifTokenExpiry: Date,
});

const User = mongoose.models.users || mongoose.model<UserDocument>('users', Userschema);

export default User;