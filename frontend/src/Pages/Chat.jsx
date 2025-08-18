import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Context } from "../main";
import { toast } from "react-toastify";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

const Chat = () => {
  const { user } = useContext(Context);
  const [chatRooms, setChatRooms] = useState([]); // Doctors list
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  // Turn two user IDs into a safe composite id
  const generateChatRoomId = (id1, id2) => {
    return id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/doctors`,
          { withCredentials: true }
        );
        const doctorChats = response.data.doctors.map((doc) => ({
          id: doc._id, // doctor's userId
          name: `${doc.firstName} ${doc.lastName}`,
        }));
        setChatRooms(doctorChats);
      } catch (err) {
        toast.error("Failed to load doctors");
        setChatRooms([]);
      }
    };
    if (user?._id) fetchDoctors();
  }, [user]);

  // Fetch messages and join socket room when selectedChat changes
  useEffect(() => {
    setMessages([]);
    if (!selectedChat || !user?._id) return;

    const chatRoomId = generateChatRoomId(user._id, selectedChat.id);

    socket.emit("joinChatRoom", { chatRoomId });

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/room/${chatRoomId}`,
          { withCredentials: true }
        );
        setMessages(response.data.chats || []);
      } catch (err) {
        setMessages([]);
      }
    };

    fetchMessages();

    return () => {
      socket.emit("leaveChatRoom", { chatRoomId });
    };
  }, [selectedChat, user]);

  // Receive socket messages
  useEffect(() => {
    const onReceiveChat = (msg) => {
      if (!selectedChat || !user?._id) return;
      const currentRoomId = generateChatRoomId(user._id, selectedChat.id);
      if (msg.chatRoomId === currentRoomId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("receiveChat", onReceiveChat);
    return () => {
      socket.off("receiveChat", onReceiveChat);
    };
  }, [selectedChat, user]);

  const handleSend = async () => {
    if (!input.trim() || !selectedChat || !user?._id) return;

    const chatRoomId = generateChatRoomId(user._id, selectedChat.id);

    const message = {
      chatRoomId,
      senderId: user._id,
      receiverId: selectedChat.id,
      text: input,
      sentAt: Date.now(),
      isBot: false,
      imageUrls: [],
      fileUrls: [],
    };

    socket.emit("sendChat", { chatRoomId, message });

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/send`, message, {
        withCredentials: true,
      });
    } catch (err) {
      toast.error("Message not saved!");
      console.error("Failed to save message", err);
    }
    setMessages((prev) => [...prev, message]);
    setInput("");
  };

  return (
    <div
      className="fixed inset-0 min-h-screen w-screen bg-gray-900 flex overflow-hidden"
      style={{ height: "100vh" }} // forces viewport height
    >
      {/* Left: chat contacts (doctors) */}
      <div className="w-1/3 bg-white dark:bg-gray-800 flex flex-col p-4 overflow-hidden">
        <button
          className="mb-4 px-4 py-2 rounded bg-blue-600 text-white font-bold self-start"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>
        <h2 className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-400">Chats</h2>
        <ul className="flex-1 overflow-y-auto pr-2">
          {chatRooms.map((chat) => (
            <li
              key={chat.id}
              className={`cursor-pointer px-2 py-3 mb-2 rounded transition ${
                selectedChat?.id === chat.id
                  ? "bg-blue-100 dark:bg-blue-900"
                  : "hover:bg-gray-100 dark:hover:bg-gray-900"
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              {chat.name}
            </li>
          ))}
          {chatRooms.length === 0 && <li>No doctors available for chat</li>}
        </ul>
      </div>

      {/* Right: chat messages */}
      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-950 p-4 overflow-hidden">
        {selectedChat ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4 pr-2">
              {messages.length === 0 && (
                <div className="text-gray-500 text-center mt-8">No messages yet</div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 flex ${
                    msg.senderId === user._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs ${
                      msg.senderId === user._id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex pb-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-lg border bg-white dark:bg-gray-800 text-black dark:text-white"
                placeholder="Type your message"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg font-semibold"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
