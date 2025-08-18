import axios from "axios";
import React, { useEffect, useState, useContext, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Context } from "../main";
import { toast } from "react-toastify";
import gsap from "gsap";
import { FaFolderPlus , FaFolderMinus  } from "react-icons/fa6";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

function getLowResCloudinaryUrl(originalUrl, width = 32, quality = 20) {
  if (!originalUrl) return "";
  return originalUrl.replace("/upload/", `/upload/w_${width},q_${quality}/`);
}

const Chat = () => {
  const { user } = useContext(Context);
  const [departments, setDepartments] = useState({});
  const [departmentsOpen, setDepartmentsOpen] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sendingDisabled, setSendingDisabled] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const lastMessageRef = useRef(null);
  const newMessageAddedRef = useRef(false);

  const generateChatRoomId = (id1, id2) =>
    id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const animateMessage = (el) => {
    if (!el || !newMessageAddedRef.current) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
    newMessageAddedRef.current = false;
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/doctors`,
          { withCredentials: true }
        );
        const byDept = {};
        response.data.doctors.forEach((doc) => {
          const dept = doc.doctorDepartment || "Other";
          if (!byDept[dept]) byDept[dept] = [];
          byDept[dept].push({
            id: doc._id,
            name: `${doc.firstName} ${doc.lastName}`,
            avatarUrl: doc.docAvatar?.url || null,
            department: dept,
          });
        });
        setDepartments(byDept);
      } catch (err) {
        toast.error("Failed to load doctors");
        setDepartments({});
      }
    };
    if (user?._id) fetchDoctors();
  }, [user]);

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
        setTimeout(() => scrollToBottom(), 100);
      } catch {
        setMessages([]);
      }
    };
    fetchMessages();

    return () => {
      socket.emit("leaveChatRoom", { chatRoomId });
    };
  }, [selectedChat, user]);

  useEffect(() => {
    const onReceiveChat = (msg) => {
      if (!selectedChat || !user?.__id) return;
      const currentRoomId = generateChatRoomId(user._id, selectedChat.id);
      if (msg.chatRoomId === currentRoomId) {
        newMessageAddedRef.current = true;
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("receiveChat", onReceiveChat);
    return () => {
      socket.off("receiveChat", onReceiveChat);
    };
  }, [selectedChat, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useLayoutEffect(() => {
    animateMessage(lastMessageRef.current);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedChat || !user?._id || sendingDisabled) return;

    setSendingDisabled(true);
    setTimeout(() => setSendingDisabled(false), 1000);

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
    newMessageAddedRef.current = false;
    setMessages((prev) => [...prev, message]);
    setInput("");
  };

  const toggleDepartment = (dept) => {
    setDepartmentsOpen((prev) => ({
      ...prev,
      [dept]: !prev[dept],
    }));
  };

  const currentAvatarUrl = selectedChat?.avatarUrl;

  return (
    <div
      className="fixed inset-0 min-h-screen w-screen bg-gray-900 flex overflow-hidden text-white"
      style={{ height: "100vh" }}
    >
      {/* Left: folder department list */}
      <div className="w-1/3 bg-white dark:bg-gray-800 flex flex-col p-4 overflow-hidden custom-scroll">
        <button
          className="mb-4 px-4 py-2 rounded bg-blue-600 text-white font-bold self-start"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>
        <h2 className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-400">Chats</h2>
        <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
          {Object.keys(departments).length === 0 && (
            <div className="text-gray-500 py-8">No doctors available for chat</div>
          )}
          {Object.entries(departments).map(([dept, doctors]) => (
            <div key={dept}>
              {/* Folder header */}
              <div
                onClick={() => toggleDepartment(dept)}
                className="flex items-center cursor-pointer px-2 py-2 rounded transition hover:bg-gray-100 dark:hover:bg-gray-900 select-none font-semibold text-base"
              >
                {departmentsOpen[dept] ? (
                  <FaFolderMinus  className="text-blue-600 mr-2" size={22} />
                ) : (
                  <FaFolderPlus className="text-blue-600 mr-2" size={22} />
                )}
                <span>{dept}</span>
              </div>
              {/* Department doctors */}
              {departmentsOpen[dept] && (
                <ul className="pl-7 pt-1">
                  {doctors.map((doc) => (
                    <li
                      key={doc.id}
                      className={`cursor-pointer flex items-center gap-2 px-2 py-2 mb-1 rounded transition ${
                        selectedChat?.id === doc.id
                          ? "bg-blue-100 dark:bg-blue-900"
                          : "hover:bg-gray-100 dark:hover:bg-gray-900"
                      }`}
                      onClick={() => setSelectedChat(doc)}
                    >
                      {doc.avatarUrl && (
                        <img
                          src={getLowResCloudinaryUrl(doc.avatarUrl)}
                          alt={doc.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      )}
                      <span className="text-sm font-medium">{doc.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right: chat panel */}
      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-950 p-4 overflow-hidden custom-scroll">
        {selectedChat ? (
          <>
            {/* Chat Header with Avatar */}
            <div className="flex items-center justify-between border-b border-gray-300 pb-3 mb-4">
              <div className="flex items-center gap-3">
                {currentAvatarUrl ? (
                  <img
                    src={getLowResCloudinaryUrl(currentAvatarUrl, 48, 20)}
                    alt={selectedChat.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-400 rounded-full" />
                )}
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {selectedChat.name}
                </h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200">
                  {selectedChat.department}
                </span>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto mb-4 pr-2 custom-scroll">
              {messages.length === 0 && (
                <div className="text-gray-500 text-center mt-8">No messages yet</div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 flex ${msg.senderId === user._id ? "justify-end" : "justify-start"}`}
                  ref={idx === messages.length - 1 ? lastMessageRef : null}
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
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
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
                disabled={sendingDisabled}
              />
              <button
                onClick={handleSend}
                disabled={sendingDisabled}
                className={`px-4 py-2 rounded-r-lg font-semibold text-white ${
                  sendingDisabled
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
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
