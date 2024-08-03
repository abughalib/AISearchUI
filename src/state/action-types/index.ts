export enum ActionType {
    CREATE_KNOWLEDGE_BASE = "create_knowledge_base",
    DELETE_KNOWLEDGE_BASE = "delete_knowledge_base",
    CHANGE_KNOWLEDGE_BASE = "change_knowledge_base",
    CHANGE_INF_MODEL = "change_inf_model",
    MAX_SIMILAR_SEARCH = "max_similar_search",
    MIN_SIMILAR_SCORE = "min_similar_score",
    UPPER_CHUNK = "upper_chunk",
    LOWER_CHUNK = "lower_chunk",
    INFERENCING_TEMPERATURE = "inference_temperature",
    INFERENCING_SEED = "inference_seed",
    INFERENCING_TOP_P = "inference_top_p",
    REPEAT_PENALTY = "repeat_penalty",
    REPEAT_LAST_N = "repeat_last_n"
}