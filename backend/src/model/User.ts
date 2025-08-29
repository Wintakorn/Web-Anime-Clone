import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Manga',
        },
    ],
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {

        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    profileImage: {
        type: String,
        default: "",
    },
    aboutMe: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;