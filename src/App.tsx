import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatDetails } from "./chat/chatType";
import UploadWindow from "./uploads";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import { useTypedSelector } from "./hooks/use-typed-selector";
import { ChatDialog } from "./chat/indvChat";
import AppHeader from "./header/header";
import "./App.css";

function createDialog(chatDetail: ChatDetails, index: number) {
  const alignmentClass =
    chatDetail.user === "AI" ? "justify-start" : "justify-end";
  const floatBox =
    chatDetail.user === "AI"
      ? "float-left clear-left"
      : "float-right clear-right";

  const widthClass = "w-4/5";
  return (
    <div key={index} className={`flex ${alignmentClass} my-2`}>
      <div className={`${widthClass} rounded box-border`}>
        <div
          className={`shadow-2xl shadow-indigo-500/40 box-border overflow-auto p-2 rounded m-1 whitespace-pre-line ${
            chatDetail.user == "AI"
              ? "bg-green-400 dark:bg-green-800"
              : "bg-blue-300 dark:bg-blue-800"
          } ${floatBox}`}
        >
          <ChatDialog {...chatDetail} />
        </div>
      </div>
    </div>
  );
}

const WEB_SOCKET_URL: string = "ws://localhost:8000/ws/";

function getSessionId() {
  const newSessionId = uuidv4();
  return newSessionId.split("-").join("");
}

const App = () => {
  const currentTable = useTypedSelector(
    (state) => state.knowledgeReducer?.table_name || ""
  );

  const currentDeployment = useTypedSelector(
    (state) => state.infModelReducer?.deployment
  );

  const currentModelName = useTypedSelector(
    (state) => state.infModelReducer?.model_name
  );

  const maxSimilarSearch = useTypedSelector(
    (state) => state.preferenceReducer?.max_similar_search
  );

  const lowerChunk = useTypedSelector(
    (state) => state.preferenceReducer?.lower_chunk
  );

  const upperChunk = useTypedSelector(
    (state) => state.preferenceReducer?.upper_chunk
  );

  const [prompt, setPrompt] = useState("");
  const [sessionId, _setSessionId] = useState<string>(getSessionId());
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [chatdetails, setChatDetails] = useState<ChatDetails[]>([
    {
      user: "AI",
      text: "This is your Personal AI Assistant",
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const updateChatDetails = (newChatDetail: ChatDetails) => {
    setChatDetails((prevChatDetails) => {
      return [...prevChatDetails, newChatDetail];
    });
  };

  const updateChatText = (newText: string) => {
    setChatDetails((prevChatDetails) => {
      const lastChatDetail = prevChatDetails[prevChatDetails.length - 1];
      if (newText !== "<|end|>") {
        if (!lastChatDetail.text.endsWith(newText)) {
          prevChatDetails[prevChatDetails.length - 1] = {
            user: lastChatDetail.user,
            text: lastChatDetail.text + newText,
          };
        }
      }

      return [...prevChatDetails];
    });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      const chatContainer = chatWindowRef.current;
      if (chatContainer) {
        chatContainer.scroll({
          top: chatContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    });
  };

  useEffect(() => {
    if (webSocket) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [webSocket]);

  useEffect(() => {
    scrollToBottom();
  }, [chatdetails]);

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendPrompt(prompt);
    }
  };

  const createPrompt = (prompt: string) => {
    return JSON.stringify({
      table_name: currentTable,
      session_id: sessionId,
      sentence: prompt,
      deployment_type: currentDeployment,
      deployment_model: currentModelName,
      max_similar_search: maxSimilarSearch,
      lower_chunk: lowerChunk,
      upper_chunk: upperChunk,
    });
  };

  const sendPrompt = (prompt: string) => {
    if (prompt.trim().length > 0 && isConnected) {
      setIsSearching(true);
      setPrompt("");
      updateChatDetails({
        text: prompt,
        user: "USER",
      });
      updateChatDetails({
        text: "",
        user: "AI",
      });
      webSocket?.send(createPrompt(prompt));
    } else {
      if (inputRef.current) {
        if (!isConnected) {
          navigator.clipboard.writeText(inputRef.current.value);
          inputRef.current.value = "";
          inputRef.current.placeholder =
            "Failed to connect to the server refresh the page & Paste it";
          inputRef.current.style.borderColor = "red";
        } else {
          inputRef.current.placeholder = "Your Prompt should not be empty";
          inputRef.current.style.borderColor = "red";
        }
      }
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
    scrollToBottom();

    //Establish Connection
    const webSocket = new WebSocket(WEB_SOCKET_URL);
    webSocket.addEventListener("open", (e) => {
      console.log("Socket Connected: ", e);
      setWebSocket(webSocket);
    });

    webSocket.addEventListener("message", (event) => {
      updateChatText(event.data);
      setIsSearching(false);
    });

    webSocket.addEventListener("close", (event) => {
      console.log("Socket Closed Connection: ", event);
      setWebSocket(null);
      setIsConnected(false);
    });

    webSocket.addEventListener("error", (event) => {
      console.log("Socket Error: ", event);
      setWebSocket(null);
      setIsConnected(false);
    });

    const currentTheme = localStorage.getItem("theme");

    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    }

    return () => {
      webSocket.removeEventListener("message", () => {
        console.log("WebSocket Closed");
      });
      webSocket.removeEventListener("close", () => {
        console.log("WebSocket Closed");
      });
      webSocket.removeEventListener("error", () => {
        console.log("WebSocket Closed");
      });

      webSocket.close();
    };
  }, []);

  return (
    <>
      <div
        className={`flex flex-col h-screen px-2 ${
          localStorage.getItem("theme") === "dark"
            ? "dark:bg-black dark:text-white"
            : ""
        }`}
      >
        <div className="h-16 flex-shrink-0 content-center">
          <AppHeader />
        </div>
        <div
          ref={chatWindowRef}
          className="flex-grow space-y-4 overflow-auto bg-blue-100 p-3 dark:bg-gray-900"
        >
          {chatdetails.map((chatDetail, index) => {
            return createDialog(chatDetail, index);
          })}
          {isSearching && (
            <div className="flex justify-start my-2">
              <div className="w-4/5 rounded box-border">
                <div className="shadow-2xl shadow-indigo-500/40 box-border overflow-auto p-2 rounded m-1 whitespace-pre-line bg-green-800 float-left clear-left">
                  <div className="typing-indicator">Searching Data</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <UploadWindow
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
        <div className="flex items-center h-16 flex-shrink-0 content-center">
          <div className="flex flex-row justify-evenly h-15 content-center m-auto">
            <div className="p-1 w-1/6 flex justify-center">
              <button
                className="text-sky-800"
                type="button"
                style={{ transition: "all .15s ease" }}
                onClick={() => setModalOpen(true)}
              >
                <FontAwesomeIcon icon={faFileImport} size="2x" />
              </button>
            </div>
          </div>
          <div className="rounded w-4/5 m-auto">
            <input
              ref={inputRef}
              value={prompt}
              className="outline-0 border-solid border-2 rounded span w-full height-footer-fields px-2 overflow-x-auto dark:bg-gray-800"
              placeholder="Type your prompt here..."
              onKeyDown={handleEnterPress}
              onChange={(e) => {
                if (e.target.value.trim().length > 0) {
                  setPrompt(e.target.value);
                  if (inputRef.current) {
                    inputRef.current.style.borderColor = "unset";
                  }
                } else {
                  if (inputRef.current) {
                    inputRef.current.placeholder =
                      "Your Prompt should not be empty";
                    setPrompt("");
                  }
                }
              }}
            />
          </div>
          <div className="p-1 w-1/6">
            <button
              className="box-border bg-blue-500 rounded p-2 w-full"
              onClick={async (e) => {
                e.preventDefault();
                sendPrompt(prompt);
              }}
              type="button"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
