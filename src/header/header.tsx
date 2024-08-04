import { useEffect, useState } from "react";
import ExtensionWindow from "../extensions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DBWindow from "../database";
import "./header.css";
import {
  Deployments,
  InferencingModel,
} from "../state/reducers/infModelReducer";
import { useTypedSelector } from "../hooks/use-typed-selector";
import { useActions } from "../hooks/use-actions";
import {
  faClockRotateLeft,
  faDatabase,
  faGear,
  faMoon,
  faPuzzlePiece,
} from "@fortawesome/free-solid-svg-icons";
import ChatHistory from "../chat/ChatHistory";
import PreferencesWindow from "../preferences";

export interface ChatList {
  id: string;
  title: string;
}

const AppHeader = () => {
  const availableModels: InferencingModel[] = [
    { deployment: Deployments.LOCAL, model_name: "PHI-2" },
    { deployment: Deployments.LOCAL, model_name: "PHI-3" },
    { deployment: Deployments.AZURE, model_name: "GPT-3.5T" },
    { deployment: Deployments.AZURE, model_name: "GPT-4o" },
  ];

  const currentTable = useTypedSelector(
    (state) => state.knowledgeReducer?.table_name || ""
  );

  const { changeInfModel } = useActions();

  const setInferencingModel = (model_param: string) => {
    // Model would always be as Deployment/ModelName;
    const deployment = model_param.split("/")[0];
    const model_name = model_param.split("/")[1];

    if (deployment === Deployments.LOCAL) {
      changeInfModel(Deployments.LOCAL, model_name);
    } else {
      changeInfModel(Deployments.AZURE, model_name);
    }
  };

  const selectedDeployment = useTypedSelector(
    (state) =>
      state.infModelReducer?.deployment || availableModels[0].deployment || ""
  );

  const selectedModel = useTypedSelector(
    (state) =>
      state.infModelReducer?.model_name || availableModels[0].model_name || ""
  );

  const currentSessionId = useTypedSelector(
    (state) => state.appReducer?.currentSession || "init"
  );

  // Manage state of Modals
  const [isExtensionOpen, setIsExtensionOpen] = useState(false);
  const [isDBOpen, setIsDBOpen] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [isPreferenceOpen, setIsPreferenceOpen] = useState(false);
  const [chatLists, setChatLists] = useState<ChatList[]>([]);

  useEffect(() => {
    setChatLists([
      ...chatLists,
      {
        id: currentSessionId,
        title: `Chat ${currentSessionId}`
      }
    ])
  }, []);

  return (
    <div className="flex h-15 p-1">
      <div className="p-1 vertical-center icon">
        <a onClick={() => setIsChatHistoryOpen(!isChatHistoryOpen)}>
          <FontAwesomeIcon icon={faClockRotateLeft} size="2x"></FontAwesomeIcon>
        </a>
        <div>
          {isChatHistoryOpen && (
            <ChatHistory
              isOpen={isChatHistoryOpen}
              chatLists={chatLists}
              setChatLists={setChatLists}
              onClose={() => {
                setIsChatHistoryOpen(false);
              }}
            />
          )}
        </div>
      </div>
      <div className="vertical-center">
        <select
          className="outline-0 p-1 vertical-center dark:bg-black"
          onChange={(e) => setInferencingModel(e.target.value)}
          defaultValue={`${selectedDeployment}/${selectedModel}`}
        >
          {availableModels.map((model, index) => {
            return (
              <option key={`${index}`}>
                {model.deployment}/{model.model_name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="flex flex-row vertical-center">
        <div className="p-1 icon tooltip">
          <a className="text-sky-600" onClick={() => setIsDBOpen(true)}>
            <FontAwesomeIcon icon={faDatabase} size="2x" />
          </a>
          <p className="tooltiptext">Selected: {currentTable}</p>
        </div>
        <DBWindow isOpen={isDBOpen} onClose={() => setIsDBOpen(false)} />
        <ExtensionWindow
          isOpen={isExtensionOpen}
          onClose={() => setIsExtensionOpen(false)}
        />
        <PreferencesWindow
          isOpen={isPreferenceOpen}
          onClose={() => setIsPreferenceOpen(false)}
        />
        <div className="p-1 icon">
          <a className="text-sky-600" onClick={() => setIsExtensionOpen(true)}>
            <FontAwesomeIcon icon={faPuzzlePiece} size="2x" />
          </a>
        </div>
        <div id="dark_mode" className="p-1 icon">
          <a
            className="dark:text-white"
            onClick={() => {
              document.documentElement.classList.toggle("dark");
              if (localStorage.getItem("theme") === "dark") {
                localStorage.setItem("theme", "light");
              } else {
                localStorage.setItem("theme", "dark");
              }
            }}
          >
            <FontAwesomeIcon icon={faMoon} size="2x" />
          </a>
        </div>
        <div className="p-1 icon">
          <a className="text-sky-600" onClick={() => setIsPreferenceOpen(true)}>
            <FontAwesomeIcon icon={faGear} size="2x" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
