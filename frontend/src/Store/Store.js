import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./Auth/Reducer";

const roootReducers = combineReducers({

    auth:authReducer,
    
});

 export const store = legacy_createStore(roootReducers,applyMiddleware(thunk));