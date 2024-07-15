import { ActionType } from "../action-types";

import {
    CreateKnowledgeBase,
    DeleteKnowledgeBase,
    ChangeKnowledgeBase,
    ChangeInfModel,
    ChangeMaxSimilarSearch,
    ChangeUpperChunk,
    ChangeLowerChunk,
    ChangeInferenceTemperature,
    ChangeInferenceSeed,
    ChangeInferenceTopP,
    ChangeRepeatPenalty,
    ChangeRepeatLastN
} from "../actions";
import { Deployments } from "../reducers/infModelReducer";


export const createKnowledgeBase = (new_table: string): CreateKnowledgeBase => ({
    type: ActionType.CREATE_KNOWLEDGE_BASE,
    payload: {
        new_table
    }
});

export const deleteKnowledgeBase = (table_name: string): DeleteKnowledgeBase => ({
    type: ActionType.DELETE_KNOWLEDGE_BASE,
    payload: {
        table_name
    }
});

export const changeKnowledgeBase = (another_table: string): ChangeKnowledgeBase => ({
    type: ActionType.CHANGE_KNOWLEDGE_BASE,
    payload: {
        another_table
    }
});

export const changeInfModel = (deployment: Deployments, model_name: string): ChangeInfModel => ({
    type: ActionType.CHANGE_INF_MODEL,
    payload: {
        deployment,
        model_name
    }
});

export const changeMaxSimilarSearch = (max_similar_search: number): ChangeMaxSimilarSearch => ({
    type: ActionType.MAX_SIMILAR_SEARCH,
    payload: {
        max_similar_search
    }
});

export const changeUpperChunk = (upper_chunk: number): ChangeUpperChunk => ({
    type: ActionType.UPPER_CHUNK,
    payload: {
        upper_chunk
    }
});

export const changeLowerChunk = (lower_chunk: number): ChangeLowerChunk => ({
    type: ActionType.LOWER_CHUNK,
    payload: {
        lower_chunk
    }
});

export const changeInferenceTemperature = (inference_temperature: number): ChangeInferenceTemperature => ({
    type: ActionType.INFERENCING_TEMPERATURE,
    payload: {
        inference_temperature
    }
});

export const changeInferenceSeed = (inference_seed: number): ChangeInferenceSeed => ({
    type: ActionType.INFERENCING_SEED,
    payload: {
        inference_seed
    }
});

export const changeInferenceTopP = (inference_top_p: number): ChangeInferenceTopP => ({
    type: ActionType.INFERENCING_TOP_P,
    payload: {
        inference_top_p
    }
});

export const changeRepeatPenalty = (repeat_penalty: number): ChangeRepeatPenalty => ({
    type: ActionType.REPEAT_PENALTY,
    payload: {
        repeat_penalty
    }
});

export const changeRepeatLastN = (repeat_last_n: number): ChangeRepeatLastN => ({
    type: ActionType.REPEAT_LAST_N,
    payload: {
        repeat_last_n
    }
});


