import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  chatRoomId: {
    type: String,
    required: true,
    index: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    default: '',
  },
  imageUrls: [String],
  fileUrls: [String],
  isBot: {
    type: Boolean,
    default: false,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  sentAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  readBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  isTyping: {
    type: Boolean,
    default: false,
  },
});

chatSchema.index({ chatRoomId: 1, sentAt: 1 });

export const Chat = mongoose.model('Chat', chatSchema);
