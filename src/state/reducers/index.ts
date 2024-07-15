import { combineReducers } from "@reduxjs/toolkit";
import knowledgeReducer from "./knowledgereducer";
import infModelReducer from "./infModelReducer";
import preferenceReducer from "./preferenceReducer";


const rootReducer = combineReducers({
    knowledgeReducer: knowledgeReducer,
    infModelReducer: infModelReducer,
    preferenceReducer: preferenceReducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>