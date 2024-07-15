import { produce } from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";

export interface KnowledgeState {
    table_name: string
}

const initState: KnowledgeState = {
    table_name: ""
}

const knowledgeReducer = produce(
    (state: KnowledgeState = initState, action: Action): KnowledgeState => {
        switch (action.type) {
            case ActionType.DELETE_KNOWLEDGE_BASE:
                state.table_name = action.payload.table_name
                return state
            case ActionType.CREATE_KNOWLEDGE_BASE:
                state.table_name = action.payload.new_table
                return state
            case ActionType.CHANGE_KNOWLEDGE_BASE:
                state.table_name = action.payload.another_table
                return state
            default:
                return state
        }
    }
);

export default knowledgeReducer;