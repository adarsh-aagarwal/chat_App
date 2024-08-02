// import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE, NEW_MESSAGE_RECEIVED } from "./ActionType";

// const initialValue = {
//   messages: [],
//   newMessage: null,
// };
// export const messageReducer = (store = initialValue, { type, payload }) => {
//   if (type === CREATE_NEW_MESSAGE) {
//     return { ...store, newMessage: payload };
//   } else if (type === GET_ALL_MESSAGE) {
//     return { ...store, messages: payload };
//   }
 

//   return store;
// };

import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE, NEW_MESSAGE_RECEIVED } from "./ActionType";

const initialValue = {
  messages: [],
  newMessage: null,
};

export const messageReducer = (store = initialValue, { type, payload }) => {
  if (type === CREATE_NEW_MESSAGE) {
    return { ...store, newMessage: payload, messages: [...store.messages, payload] };
  } else if (type === GET_ALL_MESSAGE) {
    return { ...store, messages: payload };
  } else if (type === NEW_MESSAGE_RECEIVED) {
    return { ...store, messages: [...store.messages, payload] };
  }

  return store;
};

