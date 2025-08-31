import { Server } from 'socket.io';

let io;

export const setupChatSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.FRONTEND_URL,
        process.env.DASHBOAD_URL,
        process.env.DOC_DASHBOAD_URL,
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('joinUserRoom', ({ userId }) => {
      socket.join(userId);
    });

    socket.on('joinChatRoom', ({ chatRoomId }) => {
      socket.join(chatRoomId);
    });

    socket.on('sendChat', ({ chatRoomId, message }) => {
      socket.to(chatRoomId).emit('receiveChat', message);
      socket
        .to(message.receiverId)
        .emit('notify', { text: 'New message!', ...message });
    });

    socket.on('typing', ({ chatRoomId, userId }) => {
      socket.to(chatRoomId).emit('showTyping', { userId });
    });
    socket.on('stopTyping', ({ chatRoomId, userId }) => {
      socket.to(chatRoomId).emit('hideTyping', { userId });
    });

    socket.on('online', ({ userId }) => {
      io.emit('userOnline', { userId });
    });
    socket.on('offline', ({ userId }) => {
      io.emit('userOffline', { userId });
    });

    socket.on('readMessage', ({ chatId, userId, chatRoomId }) => {
      socket.to(chatRoomId).emit('readReceipt', { chatId, userId });
    });

    socket.on('disconnect', () => {});
  });

  return io;
};
