import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExtensionWindow: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  const closeModal = (e: React.MouseEvent) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-neutral-600 bg-opacity-50 overflow-y-auto h-full w-full"
      id="upload_modal"
      ref={modalRef}
      onClick={closeModal}
    >
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-black dark:text-white">
        <div className="mt-3 text-center">
          <h3 className="text-2xl leading-6 font-medium">Extensions</h3>
          <div className="mt-2 px-7 py-3">
            <div className="my-1 flex justify-start">
              <ul>
                <li>
                  <label className="flex flex-row mx-2">
                    <input className="mx-2" type="radio" />
                    <p>Test</p>
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="upload_button"
              className={`${
                localStorage.getItem("theme") === "dark"
                  ? "border-solid bg-neutral-800 text-white"
                  : "bg-neutral-100 text-black"
              } box-border rounded p-2 w-full`}
              onClick={onClose}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionWindow;
