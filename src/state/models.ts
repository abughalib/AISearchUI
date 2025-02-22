export interface Preferences {
  max_similar_search: number;
  min_similar_score: number;
  upper_chunk: number;
  lower_chunk: number;
  repeat_last_n: number;
  repeat_penalty: number;
  inference_seed: number;
  inference_top_p: number;
  inference_temperature: number;
  system_message: string;
}
