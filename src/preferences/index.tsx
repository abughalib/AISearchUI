import { useRef } from "react";
import { useTypedSelector } from "../hooks/use-typed-selector";
import { useActions } from "../hooks/use-actions";
import "./preference.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreferencesWindow: React.FC<ModalProps> = ({
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const currentTable = useTypedSelector(
    (state) => state.knowledgeReducer?.table_name || ""
  );

  const closeModal = (e: React.MouseEvent) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  const max_similar_search = useTypedSelector(
    (state) => state.preferenceReducer?.max_similar_search
  );

  const min_similar_score = useTypedSelector(
    (state) => state.preferenceReducer?.min_similar_score || 0.6
  );

  const upper_chunk = useTypedSelector(
    (state) => state.preferenceReducer?.upper_chunk
  );

  const lower_chunk = useTypedSelector(
    (state) => state.preferenceReducer?.lower_chunk
  );

  const temperature = useTypedSelector(
    (state) => state.preferenceReducer?.inference_temperature
  );

  const seed = useTypedSelector(
    (state) => state.preferenceReducer?.inference_seed
  );

  const top_p = useTypedSelector(
    (state) => state.preferenceReducer?.inference_top_p
  );

  const repeat_penalty = useTypedSelector(
    (state) => state.preferenceReducer?.repeat_penalty
  );

  const repeat_last_n = useTypedSelector(
    (state) => state.preferenceReducer?.repeat_last_n
  );

  const modelType = useTypedSelector(
    (state) => state.infModelReducer?.model_type
  );

  const system_message = useTypedSelector(
    (state) => state.preferenceReducer?.system_message
  );

  const {
    changeMaxSimilarSearch,
    changeMinSimilarScore,
    changeInferenceTemperature,
    changeInferenceSeed,
    changeUpperChunk,
    changeLowerChunk,
    changeRepeatLastN,
    changeRepeatPenalty,
    changeInferenceTopP,
    changeSystemMessage,
  } = useActions();

  const handleSave = () => {
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-neutral-600 bg-opacity-50 overflow-y-auto h-full w-full"
      id="upload_modal"
      ref={modalRef}
      onClick={closeModal}
    >
      <div className="relative width-25p top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-black dark:text-neutral-300">
        <div className="mt-3 text-center">
          <h3 className="text-2xl leading-6 font-medium">Your Preferences</h3>
          <div className="mt-2 px-7 py-3 preference-table">
            <label className="flex justify-between flex-row">
              Knowledge Base:{" "}
              <input
                className="rounded bg-neutral-600 dark:bg-neutral-800"
                value={currentTable}
                type="text"
                disabled
              />
            </label>
            <label className="flex justify-between flex-row">
              Model Type:{" "}
              <input
                className="rounded bg-neutral-600 dark:bg-neutral-800"
                value={modelType}
                type="text"
                disabled
              />
            </label>
            <label className="flex justify-between flex-row">
              System Message:{" "}
              <input
                className="rounded overflow-auto dark:bg-neutral-700 dark:text-neutral-300"
                onChange={(e) => {
                  changeSystemMessage(e.target.value);
                }}
                value={system_message}
                type="text"
              />
            </label>
            <label className="flex justify-between flex-row">
              Max No. Similar Search:{" "}
              <input
                className="rounded outline-0 dark:bg-neutral-700 dark:text-neutral-300"
                value={max_similar_search}
                type="number"
                min={1}
                step={1}
                onChange={(e) => {
                  changeMaxSimilarSearch(Math.round(+e.target.value) || 3);
                }}
                pattern="\d+"
              />
            </label>
            <label className="flex justify-between flex-row">
              Min Similarity Score:{" "}
              <input
                className="rounded outline-0 dark:bg-neutral-700 dark:text-neutral-300"
                value={min_similar_score}
                type="number"
                min={0.0}
                max={1.0}
                step={0.01}
                onChange={(e) => {
                  console.log(+e.target.value);
                  changeMinSimilarScore(+(+e.target.value).toFixed(2) || 0.6);
                }}
                pattern="\.\d{0,2}"
              />
            </label>
            <label className="flex justify-between flex-row">
              Upper Chunk:{" "}
              <input
                className="rounded outline-0 dark:bg-neutral-700 dark:text-neutral-300"
                value={upper_chunk}
                min={0}
                step={1}
                type="number"
                onChange={(e) => {
                  changeUpperChunk(Math.round(+e.target.value) || 0);
                }}
                pattern="\d+"
              />
            </label>
            <label className="flex justify-between flex-row">
              Lower Chunk:{" "}
              <input
                className="rounded outline-0 dark:bg-neutral-700 dark:text-neutral-300"
                value={lower_chunk}
                min={0}
                step={1}
                type="number"
                onChange={(e) => {
                  changeLowerChunk(Math.round(+e.target.value) || 0);
                }}
                pattern="\d+"
              />
            </label>
            <label className="flex justify-between flex-row">
              Temperature:{" "}
              <input
                className="rounded outline-0 dark:bg-neutral-700 dark:text-neutral-300"
                value={temperature}
                type="number"
                min={0}
                step={0.1}
                max={1}
                onChange={(e) => {
                  changeInferenceTemperature(Math.round(+e.target.value) || 0);
                }}
                pattern="0|[1-9]\d*"
              />
            </label>
            <label className="flex justify-between flex-row">
              Seed:{" "}
              <input
                className="rounded outline-0 dark:bg-neutral-700 dark:text-neutral-300"
                value={seed}
                type="number"
                min={12345}
                max={655000}
                onChange={(e) => {
                  changeInferenceSeed(Math.round(+e.target.value) || 0);
                }}
                pattern="\d{1,6}"
              />
            </label>
            <label className="flex justify-between flex-row">
              Top P:{" "}
              <input
                className="rounded outline-0 dark:bg-neutral-700 dark:text-neutral-300"
                value={top_p}
                type="number"
                min={0}
                step={0.1}
                max={1}
                onChange={(e) => {
                  changeInferenceTopP(Math.round(+e.target.value) || 0);
                }}
                pattern="\d"
              />
            </label>
            <label className="flex justify-between flex-row">
              Repeat Penalty:{" "}
              <input
                className="rounded outline-0 dark:bg-neutral-700 dark:text-neutral-300"
                value={repeat_penalty}
                type="number"
                min={0}
                step={0.1}
                max={10}
                onChange={(e) => {
                  changeRepeatPenalty(Math.round(+e.target.value) || 0);
                }}
                pattern="\d\.\d"
              />
            </label>
            <label className="flex justify-between flex-row">
              Repeat Last N:{" "}
              <input
                className="rounded outline-0 dark:bg-neutral-700 dark:text-neutral-300"
                value={repeat_last_n}
                type="number"
                min={0}
                step={1}
                max={100}
                onChange={(e) => {
                  changeRepeatLastN(Math.round(+e.target.value) || 0);
                }}
                pattern="\d{2}"
              />
            </label>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="upload_button"
              className={`${
                localStorage.getItem("theme") === "dark"
                  ? "border-solid bg-neutral-800 text-white"
                  : "bg-neutral-100 text-black"
              } box-border rounded p-2 w-full`}
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesWindow;
