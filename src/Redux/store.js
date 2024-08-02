import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./Auth/Reducer";
import { chatReducer } from "./Chat/Reducer";
import { messageReducer } from "./Messsage/Reducer";

const rootReducers=combineReducers({
    auth:authReducer,
    chat:chatReducer,
    message:messageReducer
})

export const store=legacy_createStore(rootReducers,applyMiddleware(thunk))