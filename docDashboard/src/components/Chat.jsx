import axios from 'axios';
import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useLayoutEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Context } from '../main';
import { toast } from 'react-toastify';
import gsap from 'gsap';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

const Chat = () => {
  const { admin } = useContext(Context);
  const [patientList, setPatientList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sendingDisabled, setSendingDisabled] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const lastMessageRef = useRef(null);
  const newMessageAddedRef = useRef(false);

  const generateChatRoomId = (id1, id2) =>
    id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const animateMessage = (el) => {
    if (!el || !newMessageAddedRef.current) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
    newMessageAddedRef.current = false;
  };

  useEffect(() => {
    const fetchPatientList = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/patientlist`,
          {
            withCredentials: true,
          }
        );
        setPatientList(response.data.patients || []);
      } catch (err) {
        toast.error('Failed to load patients');
        setPatientList([]);
      }
    };

    if (admin?._id) fetchPatientList();
  }, [admin]);

  useEffect(() => {
    setMessages([]);
    if (!selectedPatient || !admin?._id) return;

    const chatRoomId = generateChatRoomId(admin._id, selectedPatient.id);
    socket.emit('joinChatRoom', { chatRoomId });

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
      socket.emit('leaveChatRoom', { chatRoomId });
    };
  }, [selectedPatient, admin]);

  useEffect(() => {
    const onReceiveChat = (msg) => {
      if (!selectedPatient || !admin?._id) return;
      const currentRoomId = generateChatRoomId(admin._id, selectedPatient.id);
      if (msg.chatRoomId === currentRoomId) {
        newMessageAddedRef.current = true;
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('receiveChat', onReceiveChat);

    return () => {
      socket.off('receiveChat', onReceiveChat);
    };
  }, [selectedPatient, admin]);

  useEffect(() => {
    const onMessageDeleted = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? { ...m, isDeleted: true, text: '', imageUrls: [] }
            : m
        )
      );
    };
    socket.on('messageDeleted', onMessageDeleted);
    return () => {
      socket.off('messageDeleted', onMessageDeleted);
    };
  }, []);

  useEffect(() => {
    const onMessageEdited = ({ messageId, text }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, text, isEdited: true } : m
        )
      );
    };
    socket.on('messageEdited', onMessageEdited);
    return () => {
      socket.off('messageEdited', onMessageEdited);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useLayoutEffect(() => {
    animateMessage(lastMessageRef.current);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedPatient || !admin?._id || sendingDisabled)
      return;

    setSendingDisabled(true);
    setTimeout(() => {
      setSendingDisabled(false);
    }, 1000);

    const chatRoomId = generateChatRoomId(admin._id, selectedPatient.id);

    const message = {
      chatRoomId,
      senderId: admin._id,
      receiverId: selectedPatient.id,
      text: input,
      sentAt: Date.now(),
      isBot: false,
      imageUrls: [],
      fileUrls: [],
    };

    socket.emit('sendChat', { chatRoomId, message });

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/send`,
        message,
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      toast.error('Message not saved!');
      console.error('Failed to save message', err);
    }

    newMessageAddedRef.current = false;
    setMessages((prev) => [...prev, message]);
    setInput('');
  };

  const handleDeleteMessage = async (msg) => {
    if (!msg?._id || !selectedPatient || !admin?._id) return;
    if (!window.confirm('Delete this message? This cannot be undone.')) return;
    const chatRoomId = generateChatRoomId(admin._id, selectedPatient.id);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/delete/${msg._id}`,
        { withCredentials: true }
      );
      socket.emit('deleteMessage', { chatRoomId, messageId: msg._id });
      setMessages((prev) =>
        prev.map((m) =>
          m._id === msg._id
            ? { ...m, isDeleted: true, text: '', imageUrls: [] }
            : m
        )
      );
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete message');
    }
  };

  const startEditing = (msg) => {
    setEditingId(msg._id);
    setEditText(msg.text || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEditing = async (msg) => {
    const trimmed = editText.trim();
    if (!trimmed || trimmed === msg.text || !selectedPatient || !admin?._id) {
      cancelEditing();
      return;
    }
    const chatRoomId = generateChatRoomId(admin._id, selectedPatient.id);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/edit/${msg._id}`,
        { text: trimmed },
        { withCredentials: true }
      );
      socket.emit('editMessage', { chatRoomId, messageId: msg._id, text: trimmed });
      setMessages((prev) =>
        prev.map((m) =>
          m._id === msg._id ? { ...m, text: trimmed, isEdited: true } : m
        )
      );
      toast.success('Message edited');
    } catch {
      toast.error('Failed to edit message');
    }
    cancelEditing();
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 flex flex-col overflow-hidden text-white"
      style={{ height: '100vh' }}
    >
      {/* Navbar showing current chat user */}
      <div className="flex items-center p-4 bg-gray-800 text-white">
        <button
          className="mr-4 p-2 rounded bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate('/')}
        >
          ← Back
        </button>
        <h1 className="text-xl font-semibold">
          {selectedPatient ? (
            <>
              Chat with{' '}
              <span className="font-bold text-blue-400">
                {selectedPatient.name}
              </span>
            </>
          ) : (
            'Doctor Chat'
          )}
        </h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Patients list */}
        <div className="w-1/3 bg-white dark:bg-gray-800 p-4 flex flex-col overflow-hidden custom-scroll">
          <h2 className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-400">
            Patients
          </h2>
          <ul className="flex-1 overflow-y-auto pr-2 custom-scroll">
            {patientList.length === 0 && (
              <li className="text-gray-500">No patients have messaged yet</li>
            )}
            {patientList.map((patient) => (
              <li
                key={patient.id}
                className={`cursor-pointer px-2 py-3 mb-2 rounded transition ${
                  selectedPatient?.id === patient.id
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-900'
                }`}
                onClick={() => setSelectedPatient(patient)}
              >
                {patient.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: chat messages */}
        <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-950 p-4 overflow-hidden custom-scroll">
          {selectedPatient ? (
            <>
              <div className="flex-1 overflow-y-auto mb-4 pr-2 custom-scroll">
                {messages.length === 0 && (
                  <div className="text-gray-500 text-center mt-8">
                    No messages yet
                  </div>
                )}
                {messages.map((msg, idx) => {
                  const isOwn = msg.senderId === admin._id;
                  const canModify = isOwn && msg._id && !msg.isDeleted;
                  const isEditing = editingId === msg._id;
                  return (
                    <div
                      key={msg._id || idx}
                      className={`mb-2 flex items-center gap-2 group ${isOwn ? 'justify-end' : 'justify-start'}`}
                      ref={idx === messages.length - 1 ? lastMessageRef : null}
                    >
                      {canModify && !isEditing && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => startEditing(msg)}
                            title="Edit message"
                            aria-label="Edit message"
                            className="text-gray-400 hover:text-blue-500 cursor-pointer"
                          >
                            <FaPencilAlt size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg)}
                            title="Delete message"
                            aria-label="Delete message"
                            className="text-gray-400 hover:text-red-500 cursor-pointer"
                          >
                            <FaTrash size={13} />
                          </button>
                        </div>
                      )}
                      <div
                        className={`px-4 py-2 rounded-lg max-w-xs ${
                          msg.isDeleted
                            ? 'bg-gray-200 dark:bg-gray-800 text-gray-500 italic'
                            : isOwn
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-300 dark:bg-gray-700 text-black dark:text-white'
                        }`}
                      >
                        {msg.isDeleted ? (
                          'This message was deleted'
                        ) : isEditing ? (
                          <div className="flex flex-col gap-2">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditing(msg);
                                if (e.key === 'Escape') cancelEditing();
                              }}
                              autoFocus
                              className="px-2 py-1 rounded text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none"
                            />
                            <div className="flex gap-2 justify-end text-xs">
                              <button
                                onClick={() => saveEditing(msg)}
                                className="px-2 py-1 rounded bg-white/20 hover:bg-white/30"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="px-2 py-1 rounded bg-white/20 hover:bg-white/30"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {msg.text}
                            {msg.isEdited && (
                              <span className="block text-[10px] opacity-70 mt-1">
                                (edited)
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex pb-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-l-lg border bg-white dark:bg-gray-800 text-black dark:text-white"
                  placeholder="Type your message"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  disabled={sendingDisabled}
                />
                <button
                  onClick={handleSend}
                  className={`px-4 py-2 rounded-r-lg font-semibold text-white ${
                    sendingDisabled
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={sendingDisabled}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a patient to start
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
