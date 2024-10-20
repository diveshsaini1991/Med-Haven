import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Message } from "../models/messageSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, message,to, department, doctor_firstName, doctor_lastName } = req.body;
    if (!firstName || !lastName || !email || !phone || !message || !to) {
        return next(new ErrorHandler("All Feilds Are Required !", 400))
    }
    if(to=="Doctor"){
        if (!doctor_firstName || !doctor_lastName || !department ) {
            return next(new ErrorHandler("All Feilds Are Required   !", 400))
        }
        const isConflict = await User.find({
            firstName: doctor_firstName,
            lastName: doctor_lastName,
            role: "Doctor", 
            doctorDepartment: department,
        });
        if (isConflict.length === 0) {
            return next(new ErrorHandler("Doctor not found", 404));
        }
        if (isConflict.length > 1) {
            return next(
              new ErrorHandler(
                "Doctors Conflict! Please Contact Through Email Or Phone!",
                400
              )
            );
        }
        const doctorId = isConflict[0]._id;
        await Message.create({ firstName, lastName, email, phone, message,to,doctorId,doctor: { firstName: doctor_firstName, lastName: doctor_lastName, },department });
        res.status(200).json({
            success: true,
            message: "Message Send Successfully!"
        })
    }else{
        await Message.create({ firstName, lastName, email, phone, message,to });
        res.status(200).json({
            success: true,
            message: "Message Send Successfully!"
        })
    }
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages,
    });
});

export const getMyMessages = catchAsyncErrors(async (req, res, next) => {
    const docid = req.user._id;
    const messages = await Message.find({doctorId:docid}).exec();
    res.status(200).json({
        success: true,
        messages,
    });
});