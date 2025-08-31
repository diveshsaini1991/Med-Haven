import redis from "../config/redis.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";
import transporter from "../utils/mailer.js";
import { getOtpEmailHtml } from "../service/otpEmail.js";


export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, role } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !role) {
        return next(new ErrorHandler("All Fields Are Required !", 400));
    }
    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("User Already Registered !", 400));
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`otp:${email}`, otp, { ex: 300 }); 
    
    await transporter.sendMail({
        to: email,
        subject: "Your MedHaven Registration OTP",
        html: getOtpEmailHtml(otp, firstName) 
      });

    res.status(200).json({
        success: true,
        message: "OTP sent to email for verification. Please check your inbox.",
        email 
    });
});

export const verifyPatientOtp = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, role, otp } = req.body;
    if (!email || !otp || !firstName || !lastName || !phone || !password || !gender || !dob || !role) {
        return next(new ErrorHandler("All Fields Are Required!", 400));
    }
    const savedOtp = await redis.get(`otp:${email}`);

    if (!savedOtp || savedOtp != otp) {
        return next(new ErrorHandler("Invalid or expired OTP!", 400));
    }
    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("User Already Registered!", 400));
    }
    user = await User.create({ firstName, lastName, email, phone, password, gender, dob, role });
    await redis.del(`otp:${email}`);
    generateToken(user, "User Registered!", 200, res);
});

export const resendOtp = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      return next(new ErrorHandler("Email is required", 400));
    }
  
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorHandler("User already registered with this email", 400));
    }
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`otp:${email}`, otp, { ex: 300 });
  
    await transporter.sendMail({
        to: email,
        subject: "Your Registration OTP - Resend",
        html: getOtpEmailHtml(otp) 
      });
  
    res.status(200).json({
      success: true,
      message: "OTP resent to your email. Please check your inbox.",
    });
  });


export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return next(new ErrorHandler("Please Provide All Details!", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Password or Email !", 400));
    }
    const isPasswordMached = await user.comparepassword(password);
    if (!isPasswordMached) {
        return next(new ErrorHandler("Invalid Password or Email !", 400));
    }
    if (role !== user.role) {
        return next(new ErrorHandler("User with this role not found !", 400));
    }
    generateToken(user, "User Login Successfully !", 200, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob) {
        return next(new ErrorHandler("All Fields Are Required !", 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} with This Email Already Exists !`,));
    }
    const admin = await User.create({ firstName, lastName, email, phone, password, gender, dob, role: "Admin" });
    res.status(200).json({
        success: true,
        message: "New Admin Registered!"
    })
})

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
    const doctors = await User.find({ role: "Doctor" });
    res.status(200).json({
        success: true,
        doctors
    });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user
    });
});

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("adminToken", "", {
        expires: new Date(0), 
        httpOnly: true,
        secure: true,
        sameSite: 'None',  
        domain: process.env.BACKEND_DOMAIN,
    }).json({
        success: true,
        message: "Admin Log Out Successfully !"
    });
});

export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("patientToken", "", {
        expires: new Date(0), 
        httpOnly: true,
        secure: true,
        sameSite: 'None',  
        domain: process.env.BACKEND_DOMAIN,
    }).json({
        success: true,
        message: "Patient Log Out Successfully !"
    });
});

export const logoutDoctor = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("doctorToken", "", {
        expires: new Date(0), 
        httpOnly: true,
        secure: true,
        sameSite: 'None',  
        domain: process.env.BACKEND_DOMAIN,
    }).json({
        success: true,
        message: "Doctor Log Out Successfully !"
    });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Doctor Avatar Required!", 400));
    }
    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
        return next(new ErrorHandler("File Format Not Supported!", 400));
    }
    const { firstName, lastName, email, phone, password, gender, dob, aadhaar, doctorDepartment } = req.body;
    if (!firstName || !lastName || !email || !phone || !aadhaar || !dob || !gender || !password || !doctorDepartment) {
        return next(new ErrorHandler("All Fields Are Required !", 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(
            new ErrorHandler(`${isRegistered.role} already registered with this email !`, 400)
        );
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
        docAvatar.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary Error:",
            cloudinaryResponse.error || "Unknown Cloudinary error"
        );
        return next(
            new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
        );
    }
    const doctor = await User.create({
        firstName, lastName, email, phone, aadhaar, dob, gender, password, role: "Doctor", doctorDepartment, docAvatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    res.status(200).json({
        success: true,
        message: "New Doctor Registered",
        doctor,
    });
});