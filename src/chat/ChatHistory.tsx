import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const chatHistory: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const historyRef = useRef<HTMLDivElement>(null);

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
      className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white overflow-auto"
    >
      <button
        className="absolute top-0 right-0 m-2"
        type="button"
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faXmarkCircle} />
      </button>
      <div className="my-2 flex justify-center font-bold">
        <p>Chat History</p>
      </div>
    </div>
  );
};

export default chatHistory;
