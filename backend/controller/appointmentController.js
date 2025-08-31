import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js'
import ErrorHandler from '../middlewares/errorMiddleware.js'
import { Appointment } from '../models/appointmentSchema.js'
import { User } from '../models/userSchema.js'

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler('All Fields are Required !', 400))
  }
  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: 'Doctor',
    doctorDepartment: department,
  })
  if (isConflict.length === 0) {
    return next(new ErrorHandler('Doctor not found', 404))
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        'Doctors Conflict! Please Contact Through Email Or Phone!',
        400
      )
    )
  }
  const doctorId = isConflict[0]._id
  const patientId = req.user._id
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  })
  res.status(200).json({
    success: true,
    appointment,
    message: 'Appointment Send!',
  })
})

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find()
    .sort({ appointment_date: -1 })
    .exec()
  res.status(200).json({
    success: true,
    appointments,
  })
})

export const getMyAppointments = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.user._id
  const appointments = await Appointment.find({ doctorId })
    .sort({ appointment_date: -1 })
    .exec()
  res.status(200).json({
    success: true,
    appointments,
  })
})

export const getPatientAppointments = catchAsyncErrors(
  async (req, res, next) => {
    const patientId = req.user._id
    const appointments = await Appointment.find({ patientId })
      .sort({ appointment_date: -1 })
      .exec()
    res.status(200).json({
      success: true,
      appointments,
    })
  }
)

export const updatePatientAppointment = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params
    const patientId = req.user._id

    const appointment = await Appointment.findById(id)
    if (!appointment) {
      return next(new ErrorHandler('Appointment not found!', 404))
    }

    // Ensure this appointment belongs to the logged-in patient
    if (appointment.patientId.toString() !== patientId.toString()) {
      return next(
        new ErrorHandler('Not authorized to update this appointment!', 403)
      )
    }

    // Prevent patient from updating status manually by removing it from req.body
    if ('status' in req.body) {
      delete req.body.status
    }

    // Validate doctor info if included, fetch doctorId accordingly
    if (
      req.body.doctor_firstName &&
      req.body.doctor_lastName &&
      req.body.department
    ) {
      const doctor = await User.findOne({
        firstName: req.body.doctor_firstName,
        lastName: req.body.doctor_lastName,
        role: 'Doctor',
        doctorDepartment: req.body.department,
      })
      if (!doctor) return next(new ErrorHandler('Doctor not found', 404))
      req.body.doctorId = doctor._id
      req.body.doctor = {
        firstName: doctor.firstName,
        lastName: doctor.lastName,
      }
    }

    // Update appointment fields (excluding status)
    const updatedData = {
      ...req.body,
      status: 'Updated', // Set status to "Updated" after patient update
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    )

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully!',
      appointment: updatedAppointment,
    })
  }
)

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params
    let appointment = await Appointment.findById(id)
    if (!appointment) {
      return next(new ErrorHandler('Appointment not found!', 404))
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    })
    res.status(200).json({
      success: true,
      message: 'Appointment Status Updated!',
      appointment,
    })
  }
)

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params
  const appointment = await Appointment.findById(id)
  if (!appointment) {
    return next(new ErrorHandler('Appointment Not Found!', 404))
  }
  await appointment.deleteOne()
  res.status(200).json({
    success: true,
    message: 'Appointment Deleted!',
  })
})
