import { produce } from "immer";
import { Action } from '../actions';
import { ActionType } from "../action-types";

export enum Deployments {
    LOCAL = "LOCAL",
    AZURE = "AZURE",
    SLM = "SLM",
    LLM = "LLM",
}

export interface InferencingModel {
    deployment: Deployments,
    model_name: string,
    model_type: Deployments,
}

const initState: InferencingModel = {
    deployment: Deployments.LOCAL,
    model_name: "PHI-2",
    model_type: Deployments.SLM,
}

const infModelReducer = produce(
    (state: InferencingModel = initState, action: Action): InferencingModel => {
        switch (action.type) {
            case ActionType.CHANGE_INF_MODEL:
                state.deployment = action.payload.deployment
                state.model_name = action.payload.model_name
                state.model_type = action.payload.model_type
                return state
            default:
                return state
        }
    }
);

export default infModelReducer;