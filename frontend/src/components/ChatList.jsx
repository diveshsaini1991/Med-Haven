import React from 'react';
import { FaFolderPlus, FaFolderMinus } from 'react-icons/fa6';
import { getLowResCloudinaryUrl } from '../utils/cloudinaryHelpers';

const ChatList = ({
  departments,
  departmentsOpen,
  toggleDepartment,
  selectedChat,
  setSelectedChat,
  navigate,
  isMobile,
  isActiveView,
}) => (
  <div
    className={`${
      isMobile && isActiveView ? 'w-full' : 'w-1/3'
    } custom-scroll flex flex-col overflow-hidden border-r border-teal-100 bg-white p-4 text-teal-900 dark:border-ink-600 dark:bg-ink-900 dark:text-teal-50`}
  >
    <button
      className="mb-4 self-start rounded-xl bg-teal-500 px-4 py-2 font-bold text-white shadow-lg shadow-teal-500/30 transition hover:-translate-y-0.5 hover:cursor-pointer hover:bg-teal-600"
      onClick={() => navigate('/')}
    >
      ← Back
    </button>
    <h2 className="mb-2 text-lg font-bold text-teal-700 dark:text-teal-300">
      Chats
    </h2>
    <div className="custom-scroll flex-1 overflow-y-auto pr-2">
      {Object.keys(departments).length === 0 && (
        <div className="py-8 text-teal-700/60 dark:text-teal-200/50">
          No doctors available for chat
        </div>
      )}
      {Object.entries(departments).map(([dept, doctors]) => (
        <div key={dept}>
          {/* Folder header */}
          <div
            onClick={() => toggleDepartment(dept)}
            className="flex cursor-pointer select-none items-center rounded-xl px-2 py-2 text-base font-semibold transition hover:bg-teal-50 dark:hover:bg-ink-600/40"
          >
            {departmentsOpen[dept] ? (
              <FaFolderMinus className="mr-2 text-teal-500" size={22} />
            ) : (
              <FaFolderPlus className="mr-2 text-teal-500" size={22} />
            )}
            <span>{dept}</span>
          </div>
          {/* Doctors list */}
          {departmentsOpen[dept] && (
            <ul className="pl-7 pt-1">
              {doctors.map((doc) => (
                <li
                  key={doc.id}
                  className={`mb-1 flex cursor-pointer items-center gap-2 rounded-xl px-2 py-2 transition ${
                    selectedChat?.id === doc.id
                      ? 'bg-teal-100 dark:bg-teal-900/40'
                      : 'hover:bg-teal-50 dark:hover:bg-ink-600/40'
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
);

export default ChatList;
