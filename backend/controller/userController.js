import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, aadhaar, role } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !aadhaar || !role) {
        return next(new ErrorHandler("All Fields Are Required !", 400));
    }
    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("User Already Registered !", 400));
    }
    user = await User.create({ firstName, lastName, email, phone, password, gender, dob, aadhaar, role });
    generateToken(user, "User Registered !", 200, res);
})

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
    const { firstName, lastName, email, phone, password, gender, dob, aadhaar } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !aadhaar) {
        return next(new ErrorHandler("All Fields Are Required !", 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} with This Email Already Exists !`,));
    }
    const admin = await User.create({ firstName, lastName, email, phone, password, gender, dob, aadhaar, role: "Admin" });
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
        httpOnly: true,
        expires: new Date(Date.now())
    }).json({
        success: true,
        message: "Admin Log Out Successfully !"
    });
});

export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("patientToken", "", {
        httpOnly: true,
        expires: new Date(Date.now())
    }).json({
        success: true,
        message: "Patient Log Out Successfully !"
    });
});

export const logoutDoctor = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("doctorToken", "", {
        httpOnly: true,
        expires: new Date(Date.now())
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