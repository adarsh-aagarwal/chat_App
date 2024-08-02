import React, { useState, useEffect } from 'react';
import MessageCard from './MessageCard';

const MessageComponent = ({ content, isSender }) => {
  const [delayedContent, setDelayedContent] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedContent(content);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer); // Clear the timeout if the component unmounts or content changes
  }, [content]);

  return <MessageCard content={delayedContent} isSender={isSender} />;
};

export default MessageComponent;
