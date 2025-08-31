import axios from 'axios';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Context } from '../main';
import { toast } from 'react-toastify';
import ChatList from '../components/ChatList';
import ChatRoom from '../components/ChatRoom';
import DoctorProfile from '../components/DoctorProfile';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

const generateChatRoomId = (id1, id2) =>
  id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;

const MOBILE_BREAKPOINT = 768;

const Chat = () => {
  const { user } = useContext(Context);
  const [departments, setDepartments] = useState({});
  const [departmentsOpen, setDepartmentsOpen] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sendingDisabled, setSendingDisabled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mobileViewMode, setMobileViewMode] = useState('list');
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

  const navigate = useNavigate();

  const messagesEndRef = useRef(null);
  const lastMessageRef = useRef(null);
  const newMessageAddedRef = useRef(false);

  useEffect(() => {
    document.title = 'MedHaven - Chat With Us';
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/doctors`,
          { withCredentials: true }
        );
        const byDept = {};
        response.data.doctors.forEach((doc) => {
          const dept = doc.doctorDepartment || 'Other';
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
        toast.error('Failed to load doctors');
        setDepartments({});
      }
    };
    if (user?._id) fetchDoctors();
  }, [user]);

  useEffect(() => {
    setMessages([]);
    if (!selectedChat || !user?._id) return;
    const chatRoomId = generateChatRoomId(user._id, selectedChat.id);

    socket.emit('joinChatRoom', { chatRoomId });

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/room/${chatRoomId}`,
          { withCredentials: true }
        );
        setMessages(response.data.chats || []);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } catch {
        setMessages([]);
      }
    };
    fetchMessages();

    return () => {
      socket.emit('leaveChatRoom', { chatRoomId });
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
    socket.on('receiveChat', onReceiveChat);
    return () => {
      socket.off('receiveChat', onReceiveChat);
    };
  }, [selectedChat, user]);

  const handleImageUpload = async (file) => {
    if (!file) return;

    const allowedFormats = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
    ];
    if (!allowedFormats.includes(file.type)) {
      toast.error(
        'Unsupported file format. Please upload png, jpg, jpeg, or webp.'
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    setImageUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/uploadImage`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      const imageUrl = response.data.imageUrl;
      setUploadedImageUrls((prev) => [...prev, imageUrl]);
      toast.success('Image uploaded');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setImageUploading(false);
    }
  };

  const handleMultipleImageUpload = async (files) => {
    for (const file of Array.from(files)) {
      await handleImageUpload(file);
    }
  };

  const handleSend = async () => {
    if (
      (!input.trim() && uploadedImageUrls.length === 0) ||
      !selectedChat ||
      !user?._id ||
      sendingDisabled
    )
      return;

    setSendingDisabled(true);
    setTimeout(() => setSendingDisabled(false), 1000);

    const chatRoomId = generateChatRoomId(user._id, selectedChat.id);

    const message = {
      chatRoomId,
      senderId: user._id,
      receiverId: selectedChat.id,
      text: input,
      imageUrls: uploadedImageUrls,
      fileUrls: [],
      sentAt: Date.now(),
      isBot: false,
    };

    socket.emit('sendChat', { chatRoomId, message });

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/send`,
        message,
        { withCredentials: true }
      );
    } catch (err) {
      toast.error('Message not saved!');
    }
    newMessageAddedRef.current = true;
    setMessages((prev) => [...prev, message]);
    setInput('');
    setUploadedImageUrls([]);
  };

  const toggleDepartment = (dept) => {
    setDepartmentsOpen((prev) => ({
      ...prev,
      [dept]: !prev[dept],
    }));
  };

  const currentAvatarUrl = selectedChat?.avatarUrl;

  const isMobile = windowWidth < MOBILE_BREAKPOINT;

  const onSelectChat = (doc) => {
    setSelectedChat(doc);
    setShowProfile(false);
    if (isMobile) {
      setMobileViewMode('chat');
    }
  };

  const onBackFromChatRoom = () => {
    if (isMobile) {
      setMobileViewMode('list');
      setShowProfile(false);
    }
  };

  const onBackFromProfile = () => {
    setShowProfile(false);
    if (isMobile) {
      setMobileViewMode('chat');
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-gray-900 flex text-white">
      {/* ChatList */}
      {(!isMobile || mobileViewMode === 'list') && (
        <ChatList
          departments={departments}
          departmentsOpen={departmentsOpen}
          toggleDepartment={toggleDepartment}
          selectedChat={selectedChat}
          setSelectedChat={onSelectChat}
          navigate={navigate}
          isMobile={isMobile}
          isActiveView={mobileViewMode === 'list'}
        />
      )}

      {/* ChatRoom or DoctorProfile */}
      {(!isMobile || mobileViewMode !== 'list') && (
        <>
          {showProfile ? (
            <DoctorProfile doctor={selectedChat} onBack={onBackFromProfile} />
          ) : (
            <div className="flex-1 flex flex-col">
              {isMobile && (
                <button
                  onClick={onBackFromChatRoom}
                  className="mb-2 px-4 py-2 rounded bg-blue-600 text-white font-bold self-start"
                >
                  ← Back
                </button>
              )}

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
                imageUploading={imageUploading}
                uploadedImageUrls={uploadedImageUrls}
                setUploadedImageUrls={setUploadedImageUrls}
                handleMultipleImageUpload={handleMultipleImageUpload}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Chat;
