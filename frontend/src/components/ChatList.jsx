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
    } bg-white dark:bg-gray-800 flex flex-col p-4 overflow-hidden custom-scroll`}
  >
    <button
      className="mb-4 px-4 py-2 rounded bg-blue-600 text-white font-bold self-start"
      onClick={() => navigate('/')}
    >
      ← Back
    </button>
    <h2 className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-400">
      Chats
    </h2>
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
              <FaFolderMinus className="text-blue-600 mr-2" size={22} />
            ) : (
              <FaFolderPlus className="text-blue-600 mr-2" size={22} />
            )}
            <span>{dept}</span>
          </div>
          {/* Doctors list */}
          {departmentsOpen[dept] && (
            <ul className="pl-7 pt-1">
              {doctors.map((doc) => (
                <li
                  key={doc.id}
                  className={`cursor-pointer flex items-center gap-2 px-2 py-2 mb-1 rounded transition ${
                    selectedChat?.id === doc.id
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-900'
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
