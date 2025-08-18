import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";

export const isAdminAuthanticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return next(new ErrorHandler("Admin Not Authanticated !", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "Admin") {
        return next(new ErrorHandler(`${req.user.role} not autharized for this resources!`, 403));
    }
    next();
});

export const isPatientAuthanticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
        return next(new ErrorHandler("Patient Not Authanticated !", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "Patient") {
        return next(new ErrorHandler(`${req.user.role} not autharized for this resources!`, 403));
    }
    next();
});

export const isDoctorAuthanticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.doctorToken;
    if (!token) {
        return next(new ErrorHandler("Doctor Not Authanticated !", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "Doctor") {
        return next(new ErrorHandler(`${req.user.role} not autharized for this resources!`, 403));
    }
    next();
});

export const isPatientOrDoctorAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const patientToken = req.cookies.patientToken;
    const doctorToken = req.cookies.doctorToken;
  
    let decoded, user;
    if (patientToken) {
      decoded = jwt.verify(patientToken, process.env.JWT_SECRET_KEY);
      user = await User.findById(decoded.id);
      if (user.role !== "Patient")
        return next(new ErrorHandler("User not authorized for this resource!", 403));
      req.user = user;
      return next();
    }
    if (doctorToken) {
      decoded = jwt.verify(doctorToken, process.env.JWT_SECRET_KEY);
      user = await User.findById(decoded.id);
      if (user.role !== "Doctor")
        return next(new ErrorHandler("User not authorized for this resource!", 403));
      req.user = user;
      return next();
    }
    return next(new ErrorHandler("Not Authenticated!", 400));
  });
  