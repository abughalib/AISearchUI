import {
  faPlus,
  faSquareFull,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import { useActions } from "../hooks/use-actions";
import { get_current_icon_class, getSessionId } from "../App";
import { ChatList } from "../header/header";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  chatLists: ChatList[];
  setChatLists: (chatList: ChatList[]) => void;
}

const chatHistory: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  chatLists,
  setChatLists,
}) => {
  const historyRef = useRef<HTMLDivElement>(null);
  const newChatTitle = useRef<HTMLInputElement>(null);

  const { setSession } = useActions();

  useEffect(() => {
    const handleClickOutSide = (event: MouseEvent) => {
      if (
        historyRef.current &&
        !historyRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={historyRef}
      className="fixed top-0 left-0 h-full w-64 bg-neutral-50 dark:bg-neutral-950 dark:text-neutral-300 overflow-auto"
    >
      <a className="absolute top-0 right-0 m-2" type="button" onClick={onClose}>
        <FontAwesomeIcon
          icon={faXmarkCircle}
          className={`${get_current_icon_class()}`}
          mask={
            localStorage.getItem("theme") === "dark" ? undefined : faSquareFull
          }
        />
      </a>
      <div className="my-2 flex justify-center font-bold">
        <p>Chat History</p>
      </div>
      <div className="chat-histories overflow-auto max-h-96">
        {chatLists.map((chatList) => {
          return (
            <div key={chatList.id} className="shadow-md m-1 p-2 cursor-pointer">
              <div
                className="font-semibold"
                onClick={() => setSession(chatList.id)}
              >
                {chatList.title}
              </div>
            </div>
          );
        })}
        <div className="shadow-lg m-1 p-2 rounded-md">
          <input
            ref={newChatTitle}
            className="outline-0 w-full h-full dark:bg-inherit"
            type="text"
            placeholder="Enter New Title"
          />
        </div>
        <div className="shadow-lg m-1 p-2 text-center rounded-md">
          <a
            href="#"
            className="flex justify-center items-center gap-2"
            onClick={() => {
              const newSessionId = getSessionId();
              if (
                newChatTitle.current &&
                !chatLists.find(
                  (chatList) => chatList.title === newChatTitle.current!.value
                )
              ) {
                setChatLists([
                  ...chatLists,
                  {
                    id: newSessionId,
                    title:
                      newChatTitle.current!.value || `Chat ${newSessionId}`,
                  },
                ]);
                setSession(newSessionId);
              }
            }}
          >
            Start New{" "}
            <FontAwesomeIcon
              icon={faPlus}
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

export default chatHistory;
