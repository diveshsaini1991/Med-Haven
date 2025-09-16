import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { getLowResCloudinaryUrl } from '../utils/cloudinaryHelpers';

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
  imageUploading,
  uploadedImageUrls,
  setUploadedImageUrls,
  handleMultipleImageUpload,
}) => {
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [overlayImageUrl, setOverlayImageUrl] = useState(null);
  const overlayRef = useRef(null);
  const imageRef = useRef(null);

  const containerRef = useRef(null);
  const hiddenFileInputRef = useRef(null);

  useLayoutEffect(() => {
    if (lastMessageRef.current && newMessageAddedRef.current) {
      gsap.fromTo(
        lastMessageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
      newMessageAddedRef.current = false;
    }
  }, [messages, newMessageAddedRef, lastMessageRef]);

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, messagesEndRef]);

  const onImageIconClick = () => {
    if (hiddenFileInputRef.current) {
      hiddenFileInputRef.current.click();
    }
  };

  const onFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleMultipleImageUpload(files);
      e.target.value = null;
    }
  };

  const removeImage = (index) => {
    setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const openImageOverlay = (url) => {
    setOverlayImageUrl(url);
    setShowImageOverlay(true);
  };

  const closeOverlay = () => {
    gsap.to(imageRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: 'power3.in',
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power1.in',
      onComplete: () => {
        setShowImageOverlay(false);
        setOverlayImageUrl(null);
      },
    });
  };

  React.useEffect(() => {
    if (showImageOverlay) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power1.out' }
      );
      gsap.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [showImageOverlay]);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-950 p-4 overflow-hidden"
      style={{ paddingBottom: '50px' }}
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
              <div className="text-gray-500 text-center mt-8">
                No messages yet
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 flex ${
                  msg.senderId === user._id ? 'justify-end' : 'justify-start'
                }`}
                ref={idx === messages.length - 1 ? lastMessageRef : null}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs ${
                    msg.senderId === user._id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-700 text-black dark:text-white'
                  }`}
                >
                  <div>{msg.text}</div>
                  {msg.imageUrls &&
                    msg.imageUrls.map((url, i) => (
                      <img
                        key={i}
                        src={getLowResCloudinaryUrl(url, 400, 200)}
                        alt={`chat-img-${i}`}
                        className="mt-2 w-40 h-40 object-cover rounded cursor-pointer"
                        onClick={() => openImageOverlay(url)}
                      />
                    ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Uploaded images preview above input controls */}
          {uploadedImageUrls.length > 0 && (
            <div className="flex space-x-2 overflow-x-auto p-2 bg-gray-200 dark:bg-gray-800 rounded-t-lg mb-2">
              {uploadedImageUrls.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={getLowResCloudinaryUrl(url, 200, 100)}
                    alt={`upload-preview-${idx}`}
                    className="w-16 h-16 object-cover rounded cursor-pointer"
                    onClick={() => openImageOverlay(url)}
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    type="button"
                    className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Hidden file input */}
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg,image/webp"
            ref={hiddenFileInputRef}
            onChange={onFileChange}
            className="hidden"
            disabled={imageUploading || sendingDisabled}
          />

          {/* Input controls fixed at bottom */}
          <div className="fixed bottom-0 right-0 bg-gray-100 dark:bg-gray-950 w-full md:w-2/3 p-2 shadow-inner z-40 rounded-t-lg">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-lg border bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Type your message"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                disabled={sendingDisabled}
              />
              <button
                onClick={onImageIconClick}
                className="p-2 rounded-r-lg bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
                title="Upload Image"
              >
                <HiOutlinePhotograph size={24} />
              </button>
              <button
                onClick={handleSend}
                disabled={sendingDisabled}
                className={`px-4 py-2 rounded-r-lg font-semibold hover:cursor-pointer text-white ${
                  sendingDisabled
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Send
              </button>
            </div>
          </div>

          {/* Image Overlay */}
          {showImageOverlay && (
            <div
              ref={overlayRef}
              className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-opacity-70"
              onClick={closeOverlay}
            >
              {/* Close button */}
              <button
                onClick={closeOverlay}
                className="fixed top-4 right-4 text-white text-4xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 focus:outline-none"
                aria-label="Close image"
              >
                &times;
              </button>

              <div onClick={(e) => e.stopPropagation()}>
                <img
                  ref={imageRef}
                  src={getLowResCloudinaryUrl(overlayImageUrl, 1500, 1500)}
                  alt="Full screen"
                  className="max-w-screen max-h-screen rounded-lg object-contain shadow-lg "
                />
              </div>
            </div>
          )}
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
