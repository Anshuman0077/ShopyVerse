import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Username must be required"],
        trim: true,
        unique: true,
        minlenght: 3,
        maxlenght:20
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
        maxlenght: [20, "Password must be at most 20 characters Long"]

    },
    role:{
        type: String,
        enum: ["user" , "admin"],
        default: "user",
        
    }

}, {timestamps: true});

const User = mongoose.model("User" , userSchema);
export default User;