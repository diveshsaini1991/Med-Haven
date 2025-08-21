import React, { useLayoutEffect, useEffect, useRef } from "react";
import gsap from "gsap";
import { getLowResCloudinaryUrl } from "../utils/cloudinaryHelpers";

const ChatRoom = ({
  selectedChat,
  currentAvatarUrl,
  messages,
  input,
  setInput,
  handleSend,
  sendingDisabled,
  messagesEndRef,
  lastMessageRef,
  user,
  newMessageAddedRef,
  setShowProfile,
}) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (lastMessageRef.current && newMessageAddedRef.current) {
      gsap.fromTo(
        lastMessageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
      newMessageAddedRef.current = false;
    }
  }, [messages, newMessageAddedRef, lastMessageRef]);

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-950 p-4 overflow-hidden"
      style={{ paddingBottom: "60px"}}
    >
      {selectedChat ? (
        <>
          {/* Chat Header */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setShowProfile(true)}
          >
            {currentAvatarUrl ? (
              <img
                src={getLowResCloudinaryUrl(currentAvatarUrl, 48, 20)}
                alt={selectedChat.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-400 rounded-full" />
            )}
            <h3 className="text-xl font-semibold">{selectedChat.name}</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200">
              {selectedChat.department}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 pr-2 custom-scroll">
            {messages.length === 0 && (
              <div className="text-gray-500 text-center mt-8">No messages yet</div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 flex ${
                  msg.senderId === user._id ? "justify-end" : "justify-start"
                }`}
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

          <div className="fixed bottom-0 right-0 flex bg-gray-100 dark:bg-gray-950 p-2 shadow-inner z-50 w-full md:w-2/3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 rounded-l-lg border bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                sendingDisabled ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
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
  );
};

export default ChatRoom;
