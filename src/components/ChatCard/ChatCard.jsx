

import React from "react";

function ChatCard({ userImg, name,  lastMessage, timestamp, unreadCount,typing }) {
  return (
    <div className="flex items-center justify-center py-2 cursor-pointer">
      <div className="w-[20%]">
        <img
          className="h-14 w-14 rounded-full"
          src={userImg}
          alt=""
        />
      </div>
      <div className="pl-5 w-[80%]">
        <div className="flex justify-between items-center">
          <p className="text-lg">{name}</p>
          {typing && <p className="text-gray-500 text-sm">Typing...</p>}
          <p className="text-sm">{timestamp}</p>
        </div>
       
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-600">{ lastMessage}</p>
          {unreadCount > 0 && (
            <div className="flex space-x-2 items-center">
              <p className="text-xs py-1 px-2 text-white bg-green-500 rounded-full">{unreadCount}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatCard;




