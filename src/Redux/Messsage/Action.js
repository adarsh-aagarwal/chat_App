// import { Socket } from "socket.io-client";
// import { BASE_API_URL } from "../../config/api";
// import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE } from "./ActionType";
// import { data } from "autoprefixer";


// export const createMessage = (messageData) => async (dispatch) => {
 
//   try {
//       const res = await fetch(`${BASE_API_URL}/message`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${messageData.token}`,
//         },
//         body: JSON.stringify(messageData.data),
//       });
//       const data = await res.json();
//       console.log("messages  ", data);
//       dispatch({ type: CREATE_NEW_MESSAGE, payload: data });
//     } catch (error) {
//       console.log("catch error", error);
//     }
//   };

//   export const getAllMessages = (reqData) => async (dispatch) => {
//     // console.log("get all msg",reqData)
//     try {
//       const res = await fetch(`${BASE_API_URL}/message/${reqData.chatId}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${reqData.token}`,
//         },
       
//       });
//       const data = await res.json();
//       console.log("All messages", data);
//       dispatch({ type: GET_ALL_MESSAGE, payload: data });
//     } catch (error) {
//       console.log("catch error", error);
//     }
//   };



import { BASE_API_URL } from "../../config/api";
import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE, NEW_MESSAGE_RECEIVED } from "./ActionType";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000"; // Replace with your actual endpoint
const socket = io(ENDPOINT);
export const createMessage = (messageData) => async (dispatch) => {
  console.log("message data",messageData);
  try {
    const res = await fetch(`${BASE_API_URL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${messageData.token}`,
      },
      body: JSON.stringify(messageData.data),
    });

    const data = await res.json();
    console.log("messages  ", data);

    // Dispatch the action to create the message
    dispatch({ type: CREATE_NEW_MESSAGE, payload: data });

    // Emit the new message to the socket server
    socket.emit('sendMessage', data);

  } catch (error) {
    console.log("catch error", error);
  }
};

export const getAllMessages = (reqData) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/message/${reqData.chatId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${reqData.token}`,
      },
    });

    const data = await res.json();
    console.log("All messages", data);
    dispatch({ type: GET_ALL_MESSAGE, payload: data });
  } catch (error) {
    console.log("catch error", error);
  }
};

export const receiveMessage = (message) => (dispatch) => {
  dispatch({ type: NEW_MESSAGE_RECEIVED, payload: message });
};
