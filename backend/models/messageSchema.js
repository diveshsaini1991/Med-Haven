import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [2, "First Name Must Contain At Least 2 Characters!"]
    },
    lastName: {
        type: String,
        required: true,
        minLength: [2, "First Name Must Contain At Least 2 Characters!"]
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please Provide A Valid Email!"]
    },
    phone: {
        type: String,
        required: true,
        minLength: [10, "Number Must Contain Exact 10 Digits!"],
        maxLength: [10, "Number Must Contain Exact 10 Digits!"]
    },
    message: {
        type: String,
        required: true,
        minLength: [10, "Message Must Contain Min 10 Characters!"]
    }

});

export const Message = mongoose.model("message", messageSchema);