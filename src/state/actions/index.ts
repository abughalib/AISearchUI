import { ActionType } from "../action-types";
import { Deployments } from "../reducers/infModelReducer";

export interface CreateKnowledgeBase {
  type: ActionType.CREATE_KNOWLEDGE_BASE;
  payload: {
    new_table: string;
  };
}

export interface ChangeKnowledgeBase {
  type: ActionType.CHANGE_KNOWLEDGE_BASE;
  payload: {
    another_table: string;
  };
}

export interface DeleteKnowledgeBase {
  type: ActionType.DELETE_KNOWLEDGE_BASE;
  payload: {
    table_name: string;
  };
}

export interface ChangeInfModel {
  type: ActionType.CHANGE_INF_MODEL;
  payload: {
    deployment: Deployments;
    model_name: string;
    model_type: Deployments;
  };
}

export interface ChangeMaxSimilarSearch {
  type: ActionType.MAX_SIMILAR_SEARCH;
  payload: {
    max_similar_search: number;
  };
}

export interface ChangeMinSimilarScore {
  type: ActionType.MIN_SIMILAR_SCORE;
  payload: {
    min_similar_score: number;
  };
}

export interface ChangeUpperChunk {
  type: ActionType.UPPER_CHUNK;
  payload: {
    upper_chunk: number;
  };
}

export interface ChangeLowerChunk {
  type: ActionType.LOWER_CHUNK;
  payload: {
    lower_chunk: number;
  };
}

export interface ChangeInferenceTemperature {
  type: ActionType.INFERENCING_TEMPERATURE;
  payload: {
    inference_temperature: number;
  };
}

export interface ChangeInferenceSeed {
  type: ActionType.INFERENCING_SEED;
  payload: {
    inference_seed: number;
  };
}

export interface ChangeInferenceTopP {
  type: ActionType.INFERENCING_TOP_P;
  payload: {
    inference_top_p: number;
  };
}

export interface ChangeRepeatPenalty {
  type: ActionType.REPEAT_PENALTY;
  payload: {
    repeat_penalty: number;
  };
}

export interface ChangeRepeatLastN {
  type: ActionType.REPEAT_LAST_N;
  payload: {
    repeat_last_n: number;
  };
}

export interface SetSession {
  type: ActionType.SET_SESSION;
  payload: {
    session_id: string;
  };
}

export interface SetSearching {
  type: ActionType.SET_SEARCHING;
  payload: {
    isSearching: boolean;
  };
}

export interface SetSession {
  type: ActionType.SET_SESSION;
  payload: {
    session_id: string;
  };
}

export interface SetSearching {
  type: ActionType.SET_SEARCHING;
  payload: {
    isSearching: boolean;
  };
}

export interface SetSystemMessage {
  type: ActionType.SET_SYSTEM_MESSAGE;
  payload: {
    system_message: string;
  };
}

export type Action =
  | CreateKnowledgeBase
  | ChangeKnowledgeBase
  | DeleteKnowledgeBase
  | ChangeInfModel
  | ChangeMaxSimilarSearch
  | ChangeUpperChunk
  | ChangeLowerChunk
  | ChangeInferenceTemperature
  | ChangeInferenceSeed
  | ChangeInferenceTopP
  | ChangeRepeatPenalty
  | ChangeRepeatLastN
  | ChangeMinSimilarScore
  | SetSession
  | SetSearching
  | SetSystemMessage;
