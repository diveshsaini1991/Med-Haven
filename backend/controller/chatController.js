import { Chat } from "../models/chatSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import cloudinary from "cloudinary";

export const createChatRoom = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ success: true, message: "Handled by socket or message creation." });
});

export const sendChat = catchAsyncErrors(async (req, res, next) => {
  const {
    chatRoomId,
    senderId,
    receiverId,
    text,
    imageUrls = [],
    fileUrls = [],
    isBot = false,
  } = req.body;

  const chat = await Chat.create({
    chatRoomId,
    senderId,
    receiverId,
    text,
    imageUrls,
    fileUrls,
    isBot,
    sentAt: Date.now(),
    readBy: [senderId],
    isEdited: false,
  });

  res.status(201).json({ success: true, chat });
});

export const editChat = catchAsyncErrors(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id);
  if (!chat) return res.status(404).json({ success: false, message: "Chat not found." });

  if (chat.senderId.toString() !== req.user._id.toString())
    return res.status(403).json({ success: false, message: "Not authorized." });

  chat.text = req.body.text || chat.text;
  chat.imageUrls = req.body.imageUrls || chat.imageUrls;
  chat.fileUrls = req.body.fileUrls || chat.fileUrls;
  chat.isEdited = true;

  await chat.save();

  res.json({ success: true, chat });
});

export const getPatientList = catchAsyncErrors(async (req, res, next) => {
    const doctorId = req.user._id;
  
    const chats = await Chat.find({
      $or: [
        { senderId: doctorId },
        { receiverId: doctorId }
      ]
    });
  
    const patientIdsSet = new Set();
    chats.forEach(chat => {
      if (chat.senderId.toString() !== doctorId.toString()) {
        patientIdsSet.add(chat.senderId.toString());
      }
      if (chat.receiverId.toString() !== doctorId.toString()) {
        patientIdsSet.add(chat.receiverId.toString());
      }
    });
  
    const patientIds = Array.from(patientIdsSet);
  
    const patients = await User.find({ _id: { $in: patientIds } })
      .select("_id firstName lastName");
  
    const patientList = patients.map(p => ({
      id: p._id,
      name: `${p.firstName} ${p.lastName}`,
    }));
  
    res.json({ success: true, patients: patientList });
  });

export const getChatRoomMessages = catchAsyncErrors(async (req, res, next) => {
  // chatRoomId is now a string, not an ObjectId
  const chats = await Chat.find({ chatRoomId: req.params.chatRoomId }).sort({ sentAt: 1 });
  res.json({ success: true, chats });
});

export const markChatRead = catchAsyncErrors(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id);
  if (!chat) return res.status(404).json({ success: false, message: "Chat not found." });

  if (!chat.readBy.includes(req.user._id)) {
    chat.readBy.push(req.user._id);
    await chat.save();
  }

  res.json({ success: true });
});

export const getUnreadChatsForUser = catchAsyncErrors(async (req, res, next) => {
  const chats = await Chat.find({
    receiverId: req.params.userId,
    readBy: { $ne: req.params.userId }
  });
  res.json({ success: true, chats });
});


export const uploadChatImage = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({ success: false, message: "No image file uploaded." });
  }

  const imageFile = req.files.image;

  const allowedFormats = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!allowedFormats.includes(imageFile.mimetype)) {
    return res.status(400).json({ success: false, message: "File format not supported." });
  }

  if (imageFile.size > 5 * 1024 * 1024) {
    return res.status(400).json({ success: false, message: "File size exceeds limit of 5MB." });
  }

  const result = await cloudinary.v2.uploader.upload(imageFile.tempFilePath, {
    folder: "medhaven_chat_images",
  });

  if (!result || result.error) {
    return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
  }

  res.status(201).json({ success: true, imageUrl: result.secure_url });
});