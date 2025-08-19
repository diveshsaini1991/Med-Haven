import axios from "axios";
import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Context } from "../main";
import { toast } from "react-toastify";
import ChatList from "../components/ChatList";
import ChatRoom from "../components/ChatRoom";
import DoctorProfile from "../components/DoctorProfile";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

const generateChatRoomId = (id1, id2) =>
  id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;

const Chat = () => {
  const { user } = useContext(Context);
  const [departments, setDepartments] = useState({});
  const [departmentsOpen, setDepartmentsOpen] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sendingDisabled, setSendingDisabled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();

  const messagesEndRef = useRef(null);
  const lastMessageRef = useRef(null);
  const newMessageAddedRef = useRef(false);

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
            ...doc, 
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
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
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
      if (!selectedChat || !user?._id) return;
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

  // Send message
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
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/send`,
        message,
        { withCredentials: true }
      );
    } catch (err) {
      toast.error("Message not saved!");
    }
    newMessageAddedRef.current = true;
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
    <div className="fixed inset-0 min-h-screen w-screen bg-gray-900 flex overflow-hidden text-white">
      <ChatList
        departments={departments}
        departmentsOpen={departmentsOpen}
        toggleDepartment={toggleDepartment}
        selectedChat={selectedChat}
        setSelectedChat={(doc) => {
          setSelectedChat(doc);
          setShowProfile(false); 
        }}
        navigate={navigate}
      />

      {showProfile ? (
        <DoctorProfile
          doctor={selectedChat}
          onBack={() => setShowProfile(false)}
        />
      ) : (
        <ChatRoom
          selectedChat={selectedChat}
          currentAvatarUrl={currentAvatarUrl}
          messages={messages}
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          sendingDisabled={sendingDisabled}
          messagesEndRef={messagesEndRef}
          lastMessageRef={lastMessageRef}
          user={user}
          newMessageAddedRef={newMessageAddedRef}
          setShowProfile={setShowProfile} 
        />
      )}
    </div>

  );
};

export default Chat;
