import { produce } from "immer";
import { Action } from '../actions';
import { ActionType } from "../action-types";

export enum Deployments {
    LOCAL = "LOCAL",
    AZURE = "AZURE"
}

export interface InferencingModel {
    deployment: Deployments,
    model_name: string
}

const initState: InferencingModel = {
    deployment: Deployments.LOCAL,
    model_name: "PHI-2"
}

const infModelReducer = produce(
    (state: InferencingModel = initState, action: Action): InferencingModel => {
        switch (action.type) {
            case ActionType.CHANGE_INF_MODEL:
                state.deployment = action.payload.deployment
                state.model_name = action.payload.model_name
                return state
            default:
                return state
        }
    }
);

export default infModelReducer;