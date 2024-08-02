


import React, { useState, useEffect } from "react";

const MessageCard = ({ content, isSender }) => {
  const [show, setShow] = useState(false);

  console.log(isSender);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  return show ? (
    <div
      className={`py-2 px-4 max-w-[60%] rounded-lg m-2 ${
        isSender ? "bg-green-500 text-white " : "bg-white text-black "
      }`}
    >
      <p className="break-words">{content}</p>
    </div>
  ) : null; // Don't render anything until the timer completes
};

export default MessageCard;




