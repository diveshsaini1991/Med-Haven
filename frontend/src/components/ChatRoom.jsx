import gsap from 'gsap';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
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
  handleDeleteMessage,
  handleEditMessage,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const onDeleteClick = (msg) => {
    if (window.confirm('Delete this message? This cannot be undone.')) {
      handleDeleteMessage(msg);
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
    if (!trimmed || trimmed === msg.text) {
      cancelEditing();
      return;
    }
    await handleEditMessage(msg, trimmed);
    cancelEditing();
  };

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
      className="flex-1 flex flex-col bg-teal-50/40 dark:bg-ink-900 text-teal-900 dark:text-teal-50 p-4 overflow-hidden"
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
            <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800 dark:bg-teal-900/50 dark:text-teal-200">
              {selectedChat.department}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 pr-2 custom-scroll">
            {messages.length === 0 && (
              <div className="mt-8 text-center text-teal-700/60 dark:text-teal-200/50">
                No messages yet
              </div>
            )}
            {messages.map((msg, idx) => {
              const isOwn = msg.senderId === user._id;
              const canModify = isOwn && msg._id && !msg.isDeleted;
              const isEditing = editingId === msg._id;
              return (
                <div
                  key={msg._id || idx}
                  className={`mb-2 flex items-center gap-2 group ${
                    isOwn ? 'justify-end' : 'justify-start'
                  }`}
                  ref={idx === messages.length - 1 ? lastMessageRef : null}
                >
                  {canModify && !isEditing && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => startEditing(msg)}
                        title="Edit message"
                        aria-label="Edit message"
                        className="cursor-pointer text-teal-400 hover:text-teal-600"
                      >
                        <FaPencilAlt size={13} />
                      </button>
                      <button
                        onClick={() => onDeleteClick(msg)}
                        title="Delete message"
                        aria-label="Delete message"
                        className="cursor-pointer text-teal-400 hover:text-rose-500"
                      >
                        <FaTrash size={13} />
                      </button>
                    </div>
                  )}
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-2 ${
                      msg.isDeleted
                        ? 'bg-teal-100/70 italic text-teal-600 dark:bg-ink-600/40 dark:text-teal-200/60'
                        : isOwn
                          ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                          : 'bg-white text-teal-900 shadow-sm dark:bg-ink-600 dark:text-teal-50'
                    }`}
                  >
                    {msg.isDeleted ? (
                      <div>This message was deleted</div>
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
                          className="rounded-lg border border-teal-200 bg-white px-2 py-1 text-teal-900 focus:outline-none dark:border-ink-600 dark:bg-ink-900 dark:text-teal-50"
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

          {/* Uploaded images preview above input controls */}
          {uploadedImageUrls.length > 0 && (
            <div className="mb-2 flex space-x-2 overflow-x-auto rounded-t-2xl bg-teal-100/70 p-2 dark:bg-ink-600/50">
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
          <div className="fixed bottom-0 right-0 z-40 w-full rounded-t-2xl bg-teal-50/90 p-2 shadow-inner backdrop-blur dark:bg-ink-900/90 md:w-2/3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-xl border-2 border-teal-200 bg-white px-4 py-2 text-teal-900 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/40 dark:border-ink-600 dark:bg-ink-900 dark:text-teal-50"
                placeholder="Type your message"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                disabled={sendingDisabled}
              />
              <button
                onClick={onImageIconClick}
                className="cursor-pointer rounded-xl bg-teal-500 p-2 text-white shadow-lg shadow-teal-500/30 transition hover:-translate-y-0.5 hover:bg-teal-600"
                title="Upload Image"
              >
                <HiOutlinePhotograph size={24} />
              </button>
              <button
                onClick={handleSend}
                disabled={sendingDisabled}
                className={`rounded-xl px-4 py-2 font-semibold text-white transition hover:cursor-pointer ${
                  sendingDisabled
                    ? 'cursor-not-allowed bg-teal-300'
                    : 'bg-teal-500 shadow-lg shadow-teal-500/30 hover:-translate-y-0.5 hover:bg-teal-600'
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/50 backdrop-blur-sm dark:bg-black/70"
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
