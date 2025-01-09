import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatDetails } from "./chat/chatType";
import UploadWindow from "./uploads";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileImport,
  faSquareFull,
  faStop,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { useTypedSelector } from "./hooks/use-typed-selector";
import { ChatDialog } from "./chat/indvChat";
import AppHeader from "./header/header";
import "./App.css";
import { AISEARCH_HOST, AISEARCH_PORT } from "./constants";
import { Rating } from "./chat/Rating";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons/faMicrophone";

export function get_current_button_class() {
  return localStorage.getItem("theme") === "dark" ? "dark" : "light";
}

export function get_current_icon_class() {
  return localStorage.getItem("theme") == "dark"
    ? "dark:bg-transparent dark:text-white transition hover:dark:text-grey-50"
    : "unset bg-black";
}

const WEB_SOCKET_URL: string = `ws://${AISEARCH_HOST}:${AISEARCH_PORT}/ws/`;

export function getSessionId() {
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

  const minimum_score = useTypedSelector(
    (state) => state.preferenceReducer?.min_similar_score
  );

  const lowerChunk = useTypedSelector(
    (state) => state.preferenceReducer?.lower_chunk
  );

  const upperChunk = useTypedSelector(
    (state) => state.preferenceReducer?.upper_chunk
  );

  const previousSessionId = useTypedSelector(
    (state) => state.appReducer?.previousSession || "init"
  );

  const currentSessionId = useTypedSelector(
    (state) => state.appReducer?.currentSession || "init"
  );

  const system_message = useTypedSelector(
    (state) => state?.preferenceReducer?.system_message
  );

  const chatStorage = useRef<Map<string, ChatDetails[]>>(new Map());

  const [prompt, setPrompt] = useState("");
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isRated, setIsRated] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [_currentrating, setCurrentRating] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [chatdetails, setChatDetails] = useState<ChatDetails[]>([
    {
      user: "AI",
      text: "This is your Personal AI Assistant",
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const getAriaVoice = () => {
    if (
      window.speechSynthesis
        .getVoices()
        .filter(
          (voice) =>
            voice.name ===
            "Microsoft Aria Online (Natural) - English (United States)"
        ).length !== 0
    ) {
      const voice = window.speechSynthesis;
      return voice
        .getVoices()
        .filter(
          (voice) =>
            voice.name ===
            "Microsoft Aria Online (Natural) - English (United States)"
        )[0];
    }
    return null;
  };

  const TextToSpeech = (
    text: string,
    isSpeaking: boolean,
    setIsSpeaking: (value: boolean) => void
  ) => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = getAriaVoice();
      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleSpeechToText = () => {
    setIsListening(true);
    setPrompt("Listening...");

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setPrompt((prevPrompt) => prevPrompt || "Listening Stopped...");
    } else {
      const recognitation = new ((window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition)();
      recognitation.lang = "en-US";
      recognitation.interResults = false;
      recognitation.maxAlternatives = 1;

      recognitation.onresult = (event: any) => {
        const speechresult = event.results[0][0].transcript;
        setPrompt(speechresult);
        if (inputRef.current) {
          inputRef.current.value = speechresult;
        }
      };

      recognitation.onerror = (event: any) => {
        console.error("Speech recognition error: ", event.error);
      };

      recognitation.onspeechend = () => {
        recognitation.stop();
      };

      recognitionRef.current = recognitation;
      recognitation.start();
    }
  };

  const createDialog = (chatDetail: ChatDetails, index: number) => {
    const alignmentClass =
      chatDetail.user === "AI" ? "justify-start" : "justify-end";
    const floatBox =
      chatDetail.user === "AI"
        ? "float-left clear-left"
        : "float-right clear-right";

    const handleRating = (rating: number) => {
      if (rating <= 2) {
        setIsSearching(true);
        updateChatDetails({
          text: "\n",
          user: "AI",
        });
        webSocket?.send(
          createPrompt("Try Again, The Response Seems incorrect.")
        );
        setCurrentRating(0);
        setIsRated(false);
      } else {
        setIsSearching(false);
        setIsRated(true);
      }
    };

    const widthClass = "w-4/5";
    return (
      <div
        key={index}
        className="flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div key={index} className={`flex ${alignmentClass} my-2`}>
          <div className={`${widthClass} rounded box-border`}>
            <div
              className={`overflow-auto p-2 rounded m-1 whitespace-pre-line ${
                chatDetail.user == "AI"
                  ? "bg-transparent dark:bg-transparent"
                  : "bg-neutral-300 dark:bg-neutral-800"
              } ${floatBox}`}
            >
              <ChatDialog {...chatDetail} />
            </div>
          </div>
        </div>
        {chatDetail.user === "AI" && (
          <div className="flex flex-row justify-between mx-14">
            <div>
              {(isHovered || isRated) && index !== 0 && (
                <Rating onRate={handleRating} />
              )}
            </div>
            <a href="#" className="icon icon-body">
              <FontAwesomeIcon
                icon={isSpeaking ? faStop : faVolumeHigh}
                size={"2x"}
                onClick={() =>
                  TextToSpeech(chatDetail.text, isSpeaking, setIsSpeaking)
                }
                className={`${get_current_icon_class()}`}
                mask={
                  localStorage.getItem("theme") === "dark"
                    ? undefined
                    : faSquareFull
                }
              />
            </a>
          </div>
        )}
      </div>
    );
  };

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
      session_id: currentSessionId,
      system_message: system_message,
      sentence: prompt,
      deployment_type: currentDeployment,
      deployment_model: currentModelName,
      max_similar_search: maxSimilarSearch,
      lower_chunk: lowerChunk,
      upper_chunk: upperChunk,
      minimum_score: minimum_score,
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
    if (chatdetails.length > 0) {
      chatStorage.current.set(previousSessionId, chatdetails);
    }
    if (chatStorage.current.has(currentSessionId)) {
      setChatDetails(chatStorage.current.get(currentSessionId) || []);
    } else {
      chatStorage.current.set(currentSessionId, []);
      setChatDetails([]);
    }
  }, [currentSessionId]);

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
            ? "dark:bg-black dark:text-neutral-300"
            : "light-bg"
        } main-container`}
      >
        <div className="h-16 flex-shrink-0 content-center header">
          <AppHeader />
        </div>
        <div
          ref={chatWindowRef}
          className="flex-grow space-y-4 overflow-auto bg-gray-50 p-3 dark:bg-neutral-900 main-content"
        >
          {chatdetails.map((chatDetail, index) => {
            return createDialog(chatDetail, index);
          })}
          {isSearching && (
            <div className="flex justify-start my-2">
              <div className="w-4/5 rounded box-border">
                <div className="p-2 rounded m-1 whitespace-pre-line float-left clear-left">
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
        <div className="h-18 flex-shrink-0 content-center footer">
          <div className="flex flex-row justify-evenly h-15 content-center m-auto">
            <div className="p-1 width-10 flex justify-center">
              <button
                className="icon icon-footer"
                type="button"
                style={{ transition: "all .15s ease" }}
                onClick={() => setModalOpen(true)}
              >
                <FontAwesomeIcon
                  icon={faFileImport}
                  size={"2x"}
                  className={`${get_current_icon_class()}`}
                  mask={
                    localStorage.getItem("theme") === "dark"
                      ? undefined
                      : faSquareFull
                  }
                />
              </button>
            </div>
            <div
              className={`rounded width-100 m-auto ${
                localStorage.getItem("theme") === "dark" ? "" : "search-field"
              }`}
            >
              <div className="input-container" style={{ position: "relative" }}>
                <input
                  ref={inputRef}
                  value={prompt}
                  className="outline-0 rounded span w-full height-footer-fields px-2 overflow-x-auto dark:bg-neutral-800 focus:dark:bg-neutral-700 ease-in transition"
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
                <button
                  className="icon-search-field"
                  onClick={handleSpeechToText}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    size={"2x"}
                    className={`${get_current_icon_class()}`}
                    mask={
                      localStorage.getItem("theme") === "dark"
                        ? undefined
                        : faSquareFull
                    }
                  />
                </button>
              </div>
            </div>
            <div className="p-1 width-10">
              <button
                className={`${
                  localStorage.getItem("theme") === "dark"
                    ? "border-solid bg-neutral-800 text-white"
                    : "bg-neutral-100 text-black"
                } box-border rounded p-2 w-full`}
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
        <small className="flex justify-center dark:bg-black">
          Disclaimer: AI generated content maybe inaccurate, Please verify it
          from source.
        </small>
      </div>
    </>
  );
};

export default App;
