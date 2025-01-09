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
import { faSquareFull } from "@fortawesome/free-solid-svg-icons/faSquareFull";
import { get_current_icon_class } from "../App";

export interface ChatList {
  id: string;
  title: string;
}

const AppHeader = () => {
  const availableModels: InferencingModel[] = [
    {
      deployment: Deployments.LOCAL,
      model_name: "PHI-2",
      model_type: Deployments.SLM,
    },
    {
      deployment: Deployments.LOCAL,
      model_name: "PHI-3",
      model_type: Deployments.SLM,
    },
    {
      deployment: Deployments.AZURE,
      model_name: "GPT-3.5T",
      model_type: Deployments.LLM,
    },
    {
      deployment: Deployments.AZURE,
      model_name: "GPT-4o",
      model_type: Deployments.LLM,
    },
  ];

  const currentTable = useTypedSelector(
    (state) => state.knowledgeReducer?.table_name || ""
  );

  const session_id = useTypedSelector(
    (state) => state.appReducer?.currentSession || ""
  );

  const { changeInfModel } = useActions();

  const setInferencingModel = (model_param: string) => {
    // Model would always be as Deployment/ModelName;
    const deployment = model_param.split("/")[0];
    const model_name = model_param.split("/")[1];

    if (deployment === Deployments.LOCAL) {
      changeInfModel(Deployments.LOCAL, model_name, Deployments.SLM);
    } else {
      if (model_name === "GPT-4o") {
        changeInfModel(Deployments.AZURE, model_name, Deployments.LLM);
      } else {
        changeInfModel(Deployments.AZURE, model_name, Deployments.SLM);
      }
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
        title: `Chat ${currentSessionId}`,
      },
    ]);
  }, []);

  return (
    <div className="flex h-15 p-1">
      <div className="p-1 vertical-center icon">
        <a
          className="icon-header"
          onClick={() => setIsChatHistoryOpen(!isChatHistoryOpen)}
        >
          <FontAwesomeIcon
            icon={faClockRotateLeft}
            size="2x"
            className={`${get_current_icon_class()}`}
            mask={
              localStorage.getItem("theme") === "dark"
                ? undefined
                : faSquareFull
            }
          />
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
          className="outline-0 p-1 vertical-center bg-neutral-100 dark:bg-black"
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
          <a className="icon-header" onClick={() => setIsDBOpen(true)}>
            <FontAwesomeIcon
              icon={faDatabase}
              size="2x"
              className={`${get_current_icon_class()}`}
              mask={
                localStorage.getItem("theme") === "dark"
                  ? undefined
                  : faSquareFull
              }
            />
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
          <a className="icon-header" onClick={() => setIsExtensionOpen(true)}>
            <FontAwesomeIcon
              icon={faPuzzlePiece}
              size="2x"
              className={`${get_current_icon_class()}`}
              mask={
                localStorage.getItem("theme") === "dark"
                  ? undefined
                  : faSquareFull
              }
            />
          </a>
        </div>
        <div id="dark_mode" className="p-1 icon">
          <a
            className="icon-header"
            onClick={() => {
              document.documentElement.classList.toggle("dark");
              if (localStorage.getItem("theme") === "dark") {
                localStorage.setItem("theme", "light");
              } else {
                localStorage.setItem("theme", "dark");
              }
            }}
          >
            <FontAwesomeIcon
              icon={faMoon}
              size="2x"
              className={`${get_current_icon_class()}`}
              mask={
                localStorage.getItem("theme") === "dark"
                  ? undefined
                  : faSquareFull
              }
            />
          </a>
        </div>
        <div className="p-1 icon">
          <a className="icon-header" onClick={() => setIsPreferenceOpen(true)}>
            <FontAwesomeIcon
              icon={faGear}
              size="2x"
              className={`${get_current_icon_class()}`}
              mask={
                localStorage.getItem("theme") === "dark"
                  ? undefined
                  : faSquareFull
              }
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
