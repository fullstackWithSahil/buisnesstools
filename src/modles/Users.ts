import mongoose, { Document } from 'mongoose';

interface UserDocument extends Document {
    firstName: string;
    lastname: string;
    email: string;
    password: string;
    picture?: string,
    plan: string
}

const Userschema = new mongoose.Schema<UserDocument>({
    firstName: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    picture: {type:String,required: false},
    plan:{ type: String, required:false ,default:"free" },
});


const User = mongoose.models.users || mongoose.model<UserDocument>('users', Userschema);

export default User;