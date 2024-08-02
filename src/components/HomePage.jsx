


import React, { useEffect, useState, useCallback, useRef } from "react";
import { AiOutlineBell, AiOutlineSearch } from "react-icons/ai";
import { BiSend } from "react-icons/bi";
import { BsFilter, BsThreeDotsVertical } from "react-icons/bs";
import ChatCard from "./ChatCard/ChatCard";
import MessageCard from "./MessageCard/MessageCard";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile/Profile";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Menu, MenuItem, Snackbar } from "@mui/material";
import { currentUser, handleLogout, searchUser } from "../Redux/Auth/Action";
import { createChat, getUsersChat } from "../Redux/Chat/Action";
import { createMessage, getAllMessages, receiveMessage } from "../Redux/Messsage/Action";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import Lottie from "react-lottie";
import animationData from "../animation/typing.json"
import MessageComponent from "./MessageCard/MessageComponent";

const HomePage = () => {
  const [querys, setQuerys] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [content, setContent] = useState("");
  const [isProfile, setIsProfile] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const { auth, chat, message } = useSelector((store) => store);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const token = localStorage.getItem("token");
  const endmsg = useRef(null);
  const ENDPOINT = "http://localhost:5000";
  const socket = useRef();
  const [messages, setMessages] = useState([]);
  const currentChatRef = useRef(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
 
  const [chatsArray, setChatsArray] = useState([]);
  
const defaultOptions={
  loop: true,
  autoplay: true,
  animationData: animationData,
  renderSettings:{
    preserveAspectRatio:"xMidYMid slice"
  },
};

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleCurrentChat = (item) => {
    setCurrentChat(item);
    currentChatRef.current = item;
    socket.current.emit("join chat", item._id);
  };

  useEffect(() => {
    socket.current = io(ENDPOINT);

    socket.current.on("connect", () => {
      socket.current.emit("setup", auth.reqUser);
    });

    socket.current.on("receiveMessage", (newMessage) => {
      if (newMessage.chatId !== currentChatRef.current?._id ) {
        setOpenSnackbar(true);
        
      } else {
        dispatch(receiveMessage(newMessage));
       
      }
    });

    socket.current.on("typing", () => setIsTyping(true));
    socket.current.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.current.disconnect();
      socket.current.off("receiveMessage");
      socket.current.off("typing");
      socket.current.off("stop typing");
    };
  }, [auth.reqUser, dispatch]);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleCloseOpenProfile = () => setIsProfile(false);

  const handleClickOnChatCard = (userId) => {
    dispatch(createChat({ token, data: { userId } }));
    setQuerys("");
  };

  const handleSearch = useCallback(
    (keyword) => {
      dispatch(searchUser({ keyword, token }));
    },
    [dispatch, token]
  );

  const handleCreateNewMessage = () => {
    if (!content) return;

    const tempId = uuidv4();
    const newMessage = {
      _id: tempId,
      chatId: currentChat._id,
      content: content,
      senderId: auth.reqUser._id,
      sender: { _id: auth.reqUser._id },
    };

    setMessages([...messages, newMessage]);
    socket.current.emit("new message", newMessage);
    dispatch(createMessage({ token, data: newMessage }));

    setContent("");
    socket.current.emit("stop typing", currentChat._id);
  };

  const handleNavigate = () => setIsProfile(true);

  const handleLogOut = () => {
    dispatch(handleLogout());
    navigate("/signup");
  };

  useEffect(() => {
    dispatch(currentUser(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (!auth.reqUser) {
      navigate("/signup");
    }
  }, [auth.reqUser, navigate]);

  useEffect(() => {
    dispatch(getUsersChat({ token }));
  }, [dispatch, token, chat.createdChat]);

  useEffect(() => {
    if (currentChat?._id) {
      dispatch(getAllMessages({ chatId: currentChat._id, token }));
    }
  }, [dispatch, currentChat, token, message.newMessage]);

  useEffect(() => {
    setMessages(message.messages);
  }, [message.messages]);

  // useEffect(() => {
  //   endmsg.current?.scrollIntoView();
  // }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      endmsg.current?.scrollIntoView({ behavior: "smooth" });
    }, 1500); // 1-second delay
  
    return () => clearTimeout(timer); // Cleanup the timer on component unmount or messages change
  }, [messages,typing]);

  const uniqueChats = chat.chats.reduce((acc, current) => {
    const userId =
      auth.reqUser?._id === current.users[0]?._id
        ? current.users[1]?._id
        : current.users[0]?._id;
    if (userId) {
      if (!acc[userId]) {
        acc[userId] = current;
      } else {
        acc[userId] = { ...acc[userId], ...current };
      }
    }
    return acc;
  }, {});

  // Convert the object to an array and sort by lastMessage timestamp
  useEffect(() => {
    // Make sure the chats are sorted after receiving a new message
    if (chat.chats) {
      const uniqueChats = chat.chats.reduce((acc, current) => {
        const userId =
          auth.reqUser?._id === current.users[0]?._id
            ? current.users[1]?._id
            : current.users[0]?._id;
        if (userId) {
          if (!acc[userId]) {
            acc[userId] = current;
          } else {
            acc[userId] = { ...acc[userId], ...current };
          }
        }
        return acc;
      }, {});
  
      const chatsArray = Object.values(uniqueChats).sort((a, b) => {
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  
      setChatsArray(chatsArray); // Update your state
    }
  }, [chat.chats, auth.reqUser]);
  

  const typingTimeout = useRef(null);

  const handleTyping = (e) => {
    setContent(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.current.emit("typing", currentChat._id);
    }
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    typingTimeout.current = setTimeout(() => {
      setTyping(false);
      socket.current.emit("stop typing", currentChat._id);
    }, 3000); // Stop typing after 3 seconds of inactivity
  };

   
  
 
    
  

  return (
    <div className="relative">
      <div className="w-full py-14 bg-[#00a884] "></div>
      <div className="flex bg-[#f0f2f5] h-[94vh] absolute top-6 left-6 w-[96%]">
        <div className="left w-[30%] bg-[#e8e9ec]">
          {isProfile ? (
            <Profile
              handleCloseOpenProfile={handleCloseOpenProfile}
              isusr={auth.reqUser.userName}
            />
          ) : (
            <div className="w-full">
              <div className="flex justify-between items-center p-3">
                <div
                  onClick={handleNavigate}
                  className="flex items-center space-x-3"
                >
                  <img
                    className="rounded-full w-12 h-12 cursor-pointer"
                    src="https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
                    alt=""
                  />
                  <p>{auth.reqUser?.userName}</p>
                </div>
                <div className="space-x-3 text-2xl flex items-center">
                  <div>
                    <Snackbar
                      open={openSnackbar}
                      autoHideDuration={6000}
                      onClose={handleSnackbarClose}
                    >
                      <Alert
                        onClose={handleSnackbarClose}
                        severity=""
                        variant="filled"
                        sx={{ width: "100%", backgroundColor: 'green',flexDirection: 'row'}}
                        
                      >
                         <AiOutlineBell size={24} style={{ marginRight: 8 }} />
                         <span>New Notification</span>
                      </Alert>
                    </Snackbar>
                  </div>
                  <div>
                    <BsThreeDotsVertical
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                      className="cursor-pointer"
                    />
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem
                        className="cursor-pointer"
                        onClick={handleNavigate}
                      >
                        Profile
                      </MenuItem>
                      <MenuItem
                        className="cursor-pointer"
                        onClick={handleLogOut}
                      >
                        Logout
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              </div>
              <div className="relative flex justify-center items-center bg-white py-4 px-4">
                <input
                  className="border-none outline-none bg-slate-200 rounded-md w-[93%] pl-9 py-2"
                  type="text"
                  placeholder="search or start new chat"
                  onChange={(e) => {
                    setQuerys(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  value={querys}
                />
                <AiOutlineSearch className="left-5 top-7 absolute" />
                <div>
                  <BsFilter className="ml-4 text-3xl" />
                </div>
              </div>
              <div className="bg-white overflow-y-scroll h-[76.8vh] px-3">
                {querys &&
                  auth.searchUser?.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleClickOnChatCard(item._id)}
                    >
                      <hr />
                      <ChatCard
                        name={item.userName}
                        userImg={
                          item.profile_image ||
                          "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
                        }
                      />
                    </div>
                  ))}
                {!querys &&
                  chatsArray.length > 0 &&
                  chatsArray.map((item) => (
                    <div key={item._id} onClick={() => handleCurrentChat(item)}>
                      <hr />
                      {item.isGroupChat ? (
                        <ChatCard
                          name={item.chatName}
                          userImg={
                            item.groupAdmin.profile_image ||
                            "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
                          }
                        />
                      ) : (
                        <ChatCard
                          name={
                            auth.reqUser?._id === item.users[0]?._id
                              ? item.users[1]?.userName
                              : item.users[0]?.userName
                          }
                          userImg={
                            auth.reqUser?._id === item.users[0]?._id
                              ? item.users[1]?.profile_image
                              : item.users[0]?.profile_image ||
                                "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
                          }
                          
                          
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        {currentChat ? (
          <div className="right w-[70%]">
            <div className="flex justify-between items-center bg-[#d6d8db] py-3 px-5 border-l-2">
              <div className="flex items-center space-x-4">
                <img
                  className="rounded-full w-12 h-12"
                  src="https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
                  alt=""
                />
                <h1 className="text-xl">
                  {currentChat.isGroupChat
                    ? currentChat.chatName
                    : auth.reqUser?._id === currentChat.users[0]?._id
                    ? currentChat.users[1]?.userName
                    : currentChat.users[0]?.userName}
                </h1>
              </div>
              <div className="text-2xl space-x-5 flex items-center">
                <BsThreeDotsVertical />
              </div>
            </div>
            <div className="overflow-y-scroll h-[75vh] bg-[#e8e9ec] px-4 py-2">
              {messages.map((msg) => {
                const isSender =
                  msg.sender && msg.sender._id === auth.reqUser._id;
                return (
                  <div
                    key={msg._id}
                    className={`flex ${
                      isSender ? "justify-end" : "justify-start"
                    } mb-2`}
                  >
                   <MessageComponent content={msg.content} isSender={msg.sender && msg.sender._id === auth.reqUser._id} />
                  </div>
                );
              })}
              
             
              {isTyping && <div>
                <Lottie
                width={70}
                options={defaultOptions}
                style={{marginBottom:30,marginLeft:0}}
                />
                </div>}
                <div ref={endmsg} />
                
            </div>
            <div className="relative flex items-center justify-between bg-[#f0f2f5] px-4 py-2">
              <div className="flex space-x-2 text-2xl"></div>
              <input
                className="border-none outline-none bg-white rounded-md w-full py-2 px-3"
                type="text"
                placeholder="Type a message"
                onChange={handleTyping}
                value={content}
                
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCreateNewMessage();
                  }
                }}
              />
              <div className="flex space-x-2 text-2xl items-center">
                <BiSend
                  className="cursor-pointer text-3xl text-green-500 ml-2"
                  onClick={handleCreateNewMessage}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center w-full text-2xl text-[#667781]">
            <img
              className="w-[500px]"
              src="https://images.unsplash.com/photo-1491745883818-cbe41b76e7d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
              alt=""
            />
            <h1 className="my-5 text-center">Click on a user or search to start conversation</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
