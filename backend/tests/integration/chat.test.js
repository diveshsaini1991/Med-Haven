import { describe, it, expect } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import { Chat } from '../../models/chatSchema.js';
import { createTestUser, generateAuthCookie } from '../helpers.js';

describe('Chat Routes', () => {
  let patient, doctor;
  let patientCookie, doctorCookie;
  const chatRoomId = 'room-test-123';

  beforeEach(async () => {
    patient = await createTestUser({ email: 'chat-patient@test.com', role: 'Patient' });
    doctor = await createTestUser({ email: 'chat-doctor@test.com', role: 'Doctor', doctorDepartment: 'Cardiology' });
    patientCookie = generateAuthCookie(patient).cookie;
    doctorCookie = generateAuthCookie(doctor).cookie;
  });

  describe('POST /api/v1/chat/send', () => {
    it('should send a chat message', async () => {
      const res = await request(app)
        .post('/api/v1/chat/send')
        .set('Cookie', [patientCookie])
        .send({
          chatRoomId,
          senderId: patient._id.toString(),
          receiverId: doctor._id.toString(),
          text: 'Hello doctor, I need help!',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.chat.text).toBe('Hello doctor, I need help!');
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/v1/chat/send')
        .send({ chatRoomId, text: 'test' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/chat/room/:chatRoomId', () => {
    it('should return messages in a chat room', async () => {
      await Chat.create({
        chatRoomId,
        senderId: patient._id,
        receiverId: doctor._id,
        text: 'Message 1',
      });
      await Chat.create({
        chatRoomId,
        senderId: doctor._id,
        receiverId: patient._id,
        text: 'Message 2',
      });

      const res = await request(app)
        .get(`/api/v1/chat/room/${chatRoomId}`)
        .set('Cookie', [patientCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.chats.length).toBe(2);
    });
  });

  describe('PUT /api/v1/chat/edit/:id', () => {
    it('should allow sender to edit their message', async () => {
      const chat = await Chat.create({
        chatRoomId,
        senderId: patient._id,
        receiverId: doctor._id,
        text: 'Original message',
      });

      const res = await request(app)
        .put(`/api/v1/chat/edit/${chat._id}`)
        .set('Cookie', [patientCookie])
        .send({ text: 'Edited message' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.chat.text).toBe('Edited message');
      expect(res.body.chat.isEdited).toBe(true);
    });

    it('should not allow non-sender to edit', async () => {
      const chat = await Chat.create({
        chatRoomId,
        senderId: patient._id,
        receiverId: doctor._id,
        text: 'Patient message',
      });

      const res = await request(app)
        .put(`/api/v1/chat/edit/${chat._id}`)
        .set('Cookie', [doctorCookie])
        .send({ text: 'Doctor trying to edit' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 when editing a non-existent message', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/v1/chat/edit/${fakeId}`)
        .set('Cookie', [patientCookie])
        .send({ text: 'No such message' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/chat/delete/:id', () => {
    it('should allow sender to soft-delete their message', async () => {
      const chat = await Chat.create({
        chatRoomId,
        senderId: patient._id,
        receiverId: doctor._id,
        text: 'Delete me',
      });

      const res = await request(app)
        .delete(`/api/v1/chat/delete/${chat._id}`)
        .set('Cookie', [patientCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.chatId).toBe(chat._id.toString());

      const updated = await Chat.findById(chat._id);
      expect(updated.isDeleted).toBe(true);
      expect(updated.text).toBe('');
      expect(updated.deletedAt).toBeDefined();
    });

    it('should not allow non-sender to delete', async () => {
      const chat = await Chat.create({
        chatRoomId,
        senderId: patient._id,
        receiverId: doctor._id,
        text: 'Patient message',
      });

      const res = await request(app)
        .delete(`/api/v1/chat/delete/${chat._id}`)
        .set('Cookie', [doctorCookie]);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);

      const updated = await Chat.findById(chat._id);
      expect(updated.isDeleted).toBe(false);
    });

    it('should return 404 for a non-existent message', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/v1/chat/delete/${fakeId}`)
        .set('Cookie', [patientCookie]);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/chat/read/:id', () => {
    it('should mark chat as read', async () => {
      const chat = await Chat.create({
        chatRoomId,
        senderId: doctor._id,
        receiverId: patient._id,
        text: 'Read me',
        readBy: [doctor._id],
      });

      const res = await request(app)
        .put(`/api/v1/chat/read/${chat._id}`)
        .set('Cookie', [patientCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/chat/unread/:userId', () => {
    it('should return unread chats for user', async () => {
      await Chat.create({
        chatRoomId,
        senderId: doctor._id,
        receiverId: patient._id,
        text: 'Unread message',
        readBy: [doctor._id],
      });

      const res = await request(app)
        .get(`/api/v1/chat/unread/${patient._id}`)
        .set('Cookie', [patientCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.chats.length).toBe(1);
    });
  });

  describe('GET /api/v1/chat/patientlist', () => {
    it('should return list of patients doctor chatted with', async () => {
      await Chat.create({
        chatRoomId,
        senderId: patient._id,
        receiverId: doctor._id,
        text: 'Hi doc',
      });

      const res = await request(app)
        .get('/api/v1/chat/patientlist')
        .set('Cookie', [doctorCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.patients.length).toBeGreaterThan(0);
    });
  });
});
