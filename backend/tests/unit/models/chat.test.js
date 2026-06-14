import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import { Chat } from '../../../models/chatSchema.js';

describe('Chat Model', () => {
  const validChat = {
    chatRoomId: 'room-123',
    senderId: new mongoose.Types.ObjectId(),
    receiverId: new mongoose.Types.ObjectId(),
    text: 'Hello doctor!',
  };

  it('should create a valid chat message', async () => {
    const chat = await Chat.create(validChat);
    expect(chat._id).toBeDefined();
    expect(chat.text).toBe('Hello doctor!');
    expect(chat.isEdited).toBe(false);
    expect(chat.isBot).toBe(false);
  });

  it('should default isEdited to false', async () => {
    const chat = await Chat.create(validChat);
    expect(chat.isEdited).toBe(false);
  });

  it('should default isBot to false', async () => {
    const chat = await Chat.create(validChat);
    expect(chat.isBot).toBe(false);
  });

  it('should set sentAt automatically', async () => {
    const chat = await Chat.create(validChat);
    expect(chat.sentAt).toBeDefined();
    expect(chat.sentAt instanceof Date).toBe(true);
  });

  it('should allow empty text with imageUrls', async () => {
    const chat = await Chat.create({
      ...validChat,
      text: '',
      imageUrls: ['https://example.com/img.png'],
    });
    expect(chat.imageUrls).toHaveLength(1);
  });

  it('should fail without required chatRoomId', async () => {
    await expect(
      Chat.create({ senderId: validChat.senderId, receiverId: validChat.receiverId })
    ).rejects.toThrow();
  });

  it('should store readBy array', async () => {
    const userId = new mongoose.Types.ObjectId();
    const chat = await Chat.create({ ...validChat, readBy: [userId] });
    expect(chat.readBy).toHaveLength(1);
    expect(chat.readBy[0].toString()).toBe(userId.toString());
  });
});
