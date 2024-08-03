import { produce } from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Preferences } from "../models";

const initState: Preferences = {
    max_similar_search: 10,
    min_similar_score: 0.6,
    upper_chunk: 5,
    lower_chunk: 5,
    repeat_last_n: 64,
    repeat_penalty: 1.1,
    inference_seed: 12345,
    inference_top_p: 0,
    inference_temperature: 0
}

const preferenceReducer = produce(
    (state: Preferences = initState, action: Action): Preferences => {
        switch (action.type) {
            case ActionType.MAX_SIMILAR_SEARCH:
                state.max_similar_search = action.payload.max_similar_search
                return state
            case ActionType.UPPER_CHUNK:
                state.upper_chunk = action.payload.upper_chunk
                return state
            case ActionType.LOWER_CHUNK:
                state.lower_chunk = action.payload.lower_chunk
                return state
            case ActionType.REPEAT_LAST_N:
                state.repeat_last_n = action.payload.repeat_last_n
                return state
            case ActionType.REPEAT_PENALTY:
                state.repeat_penalty = action.payload.repeat_penalty
                return state
            case ActionType.INFERENCING_SEED:
                state.inference_seed = action.payload.inference_seed
                return state
            case ActionType.INFERENCING_TOP_P:
                state.inference_top_p = action.payload.inference_top_p
                return state
            case ActionType.INFERENCING_TEMPERATURE:
                state.inference_temperature = action.payload.inference_temperature
                return state
            case ActionType.MIN_SIMILAR_SCORE:
                state.min_similar_score = action.payload.min_similar_score
                return state
            default:
                return state
        }
    }
);

export default preferenceReducer;