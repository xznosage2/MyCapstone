import mongoose, { Document, Schema } from "mongoose"

export interface IUser extends Document {
    username: string;
    password: string;
}

const userSchema: Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
        },    
    password: {
        type: String,
        required: true
        },
});

const User =
    mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;